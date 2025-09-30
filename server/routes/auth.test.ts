import passport from "passport";
import supertest from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as cookies from "../utils/cookies";
import { issueToken } from "../utils/tokens";

let spy: any;
let app: any;
let findUniqueMock = vi.fn();

const buildAppWithMock = async (implementation: any) => {
  vi.resetModules();
  spy = vi.spyOn(passport, "authenticate").mockImplementation(implementation);
  app = (await import("../utils/app")).default;
  return { spy, app };
};

describe("GET /auth/login/:provider", () => {
  beforeEach(async () => {
    await buildAppWithMock(
      () => (req: any, res: any) => res.redirect("https://example.com/auth")
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return 400 if provider is invalid", async () => {
    const response = await supertest(app).get("/api/auth/login/invalid");
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid provider" });
  });

  it("should return 400 if redirectURL is not provided", async () => {
    const response = await supertest(app).get("/api/auth/login/google");
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "The redirect URL query parameter is required",
    });
  });

  it("should return 400 if invalid redirectURL is provided", async () => {
    const response = await supertest(app).get(
      "/api/auth/login/google?redirectURL=invalid"
    );
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Invalid redirect URL",
    });
  });

  it("should redirect to authentication provider", async () => {
    const response = await supertest(app).get(
      "/api/auth/login/google?redirectURL=http://localhost:3000"
    );
    const cookieHeader = response.headers["set-cookie"] as unknown as string[];

    const loginOriginCookie = cookieHeader.find((cookie) =>
      cookie.includes(cookies.LOGIN_ORIGIN_COOKIE)
    );

    expect(cookieHeader).toBeDefined();
    expect(cookieHeader.length).toBeGreaterThan(0);
    expect(loginOriginCookie).toContain("HttpOnly");
    expect(loginOriginCookie).toContain("Lax");
    expect(loginOriginCookie).toContain("Path=/");
    expect(response.status).toBe(302);
    expect(spy).toHaveBeenCalledWith("google", { session: false });
  });
});

describe("CALLBACK /auth/callback/:path", () => {
  beforeEach(async () => {
    await buildAppWithMock(() => (req: any, res: any, next: any) => next());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should redirect to login page if no user is found", async () => {
    const response = await supertest(app).get("/api/auth/callback/google");
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("/login");
  });
});

describe("CALLBACK /auth/callback/:path", () => {
  beforeEach(async () => {
    await buildAppWithMock(() => (req: any, res: any, next: any) => {
      req.user = { id: "123" };
      return next();
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should set a cookie and redirect to the path", async () => {
    const response = await supertest(app)
      .get("/api/auth/callback/google")
      .set("Cookie", [`${cookies.LOGIN_ORIGIN_COOKIE}=http://localhost:3000`]);

    const cookieHeaders = response.headers["set-cookie"] as unknown as string[];
    const tokenCookie = cookieHeaders.find((cookie) =>
      cookie.includes(cookies.TOKEN_COOKIE)
    );
    const loginOriginCookie = cookieHeaders.find((cookie) =>
      cookie.includes(cookies.LOGIN_ORIGIN_COOKIE)
    );

    expect(response.status).toBe(302);
    expect(cookieHeaders).toBeDefined();
    expect(cookieHeaders.length).toBeGreaterThan(0);
    expect(tokenCookie).toContain("HttpOnly");
    expect(tokenCookie).toContain("Lax");
    expect(tokenCookie).toContain("Path=/");
    expect(response.headers.location).toBe("http://localhost:3000");
    expect(loginOriginCookie).toContain(`${cookies.LOGIN_ORIGIN_COOKIE}=;`);
    expect(loginOriginCookie).toMatch(/Expires=/);
  });
});

describe("POST /auth/refresh-token", () => {
  let app: any;

  beforeEach(async () => {
    vi.resetModules();
    vi.mock("../middleware/csrf-verification", () => ({
      default: (req: any, res: any, next: any) => next(),
    }));

    vi.mock("../../database/prisma", () => ({
      default: {
        user: {
          findUnique: findUniqueMock,
        },
      },
    }));

    app = (await import("../utils/app")).default;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return 401 if no token is provided", async () => {
    const response = await supertest(app).post("/api/auth/refresh-token");
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "No token found" });
  });

  it("should return 401 if invalid token is passed", async () => {
    const response = await supertest(app)
      .post("/api/auth/refresh-token")
      .send({})
      .set("Cookie", `${cookies.TOKEN_COOKIE}=some-token`);

    expect(response.status).toBe(401);
    expect(response.body.error).toMatch(/invalid token/i);
  });

  it("should return 401 if expired token is passed", async () => {
    const iat = Math.floor(Date.now() / 1000 - 8 * 24 * 60 * 60);
    const token = issueToken("123", iat);
    const response = await supertest(app)
      .post("/api/auth/refresh-token")
      .send({})
      .set("Cookie", `${cookies.TOKEN_COOKIE}=${token}`);

    expect(response.status).toBe(401);
    expect(response.body.error).toMatch(/max age exceeded/i);
  });

  it("should return 401 if user is not found", async () => {
    findUniqueMock.mockReturnValueOnce(null);
    const token = issueToken("123");
    const response = await supertest(app)
      .post("/api/auth/refresh-token")
      .send({})
      .set("Cookie", `${cookies.TOKEN_COOKIE}=${token}`);

    expect(response.status).toBe(401);
    expect(response.body.error).toMatch(/could not find the user/i);
  });

  it("should return 200 if user is found", async () => {
    findUniqueMock.mockReturnValueOnce({
      id: "123",
      email: "example@gmail.com",
      name: null,
      avatar: null,
    });
    const token = issueToken("123");
    const response = await supertest(app)
      .post("/api/auth/refresh-token")
      .send({})
      .set("Cookie", `${cookies.TOKEN_COOKIE}=${token}`);

    const cookieHeaders = response.headers["set-cookie"] as unknown as string[];
    const tokenCookie = cookieHeaders.find((cookie) =>
      cookie.includes(cookies.TOKEN_COOKIE)
    );

    expect(cookieHeaders).toBeDefined();
    expect(cookieHeaders.length).toBeGreaterThan(0);
    expect(tokenCookie).toContain("HttpOnly");
    expect(tokenCookie).toContain("Lax");
    expect(tokenCookie).toContain("Path=/");
    expect(tokenCookie).not.toContain(token);
    expect(response.status).toBe(200);
  });
});

describe("POST /auth/logout", () => {
  let app: any;

  beforeEach(async () => {
    vi.resetModules();
    vi.mock("../middleware/csrf-verification", () => ({
      default: (req: any, res: any, next: any) => next(),
    }));

    app = (await import("../utils/app")).default;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should clear the token cookie", async () => {
    const response = await supertest(app).post("/api/auth/logout");
    const cookieHeaders = response.headers["set-cookie"] as unknown as string[];
    const tokenCookie = cookieHeaders.find((cookie) =>
      cookie.includes(cookies.TOKEN_COOKIE)
    );

    expect(cookieHeaders).toBeDefined();
    expect(cookieHeaders.length).toBeGreaterThan(0);
    expect(tokenCookie).toContain(`${cookies.TOKEN_COOKIE}=;`);
    expect(tokenCookie).toMatch(/Expires=/);
    expect(response.status).toBe(200);
  });
});
