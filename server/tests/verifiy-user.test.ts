import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Profile } from "passport";
import verify from "../passport/verify";
import prisma from "../../database/prisma";

describe("passport verify user", () => {
  const mockProfile: Partial<Profile> = {
    id: "12345",
    displayName: "John Doe",
    photos: [{ value: "https://example.com/avatar.jpg" }],
    emails: [{ value: "example@gmail.com" }],
    provider: "google",
  };

  const mockUser = {
    id: "123",
    email: "johndoe@gmail.com",
    name: "John Doe",
    avatar: "https://example.com/avatar.jpg",
  };

  const mockAccount = {
    id: "acc123",
    providerAccountId: "12345",
    provider: "google",
    userId: "123",
  };

  const mockDone = vi.fn();

  beforeEach(async () => {
    vi.resetModules();
    vi.mock("../../database/prisma", () => ({
      default: {
        $transaction: vi.fn(),
        user: {
          findUnique: vi.fn(),
        },
        account: {
          findUnique: vi.fn(),
          create: vi.fn(),
        },
      },
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should call done with error if email is not found", async () => {
    const profileWithoutEmail = { ...mockProfile, emails: undefined };
    await verify("", "", profileWithoutEmail as Profile, mockDone);
    expect(mockDone).toHaveBeenCalledWith(expect.any(Error));
    expect(mockDone.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(mockDone.mock.calls[0][0].message).toMatch(/Email not found/i);
  });

  it("should handle existing user with existing account", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(mockUser);
    vi.mocked(prisma.account.findUnique).mockResolvedValueOnce(mockAccount);

    await verify("", "", mockProfile as Profile, mockDone);
    expect(mockDone).toHaveBeenCalledWith(null, {
      id: mockUser.id,
      email: mockUser.email,
      avatar: mockUser.avatar,
      name: mockUser.name,
    });
  });

  it("should handle existing user without existing account", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(mockUser);
    vi.mocked(prisma.account.findUnique).mockResolvedValueOnce(null);
    vi.mocked(prisma.account.create).mockResolvedValueOnce(mockAccount);

    await verify("", "", mockProfile as Profile, mockDone);
    expect(prisma.account.create).toHaveBeenCalledWith({
      data: {
        providerAccountId: mockProfile.id,
        provider: mockProfile.provider,
        userId: mockUser.id,
      },
    });
    expect(mockDone).toHaveBeenCalledWith(null, {
      id: mockUser.id,
      email: mockUser.email,
      avatar: mockUser.avatar,
      name: mockUser.name,
    });
  });

  it("should handle new user creation", async () => {
    vi.mocked(prisma.$transaction).mockImplementationOnce(async (cb) => {
      const tx = {
        user: {
          create: vi.fn().mockResolvedValueOnce(mockUser),
        },
        account: {
          create: vi.fn().mockResolvedValueOnce(mockAccount),
        },
      };
      return cb(tx as any);
    });
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);

    await verify("", "", mockProfile as Profile, mockDone);
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(mockDone).toHaveBeenCalledWith(null, {
      id: mockUser.id,
      email: mockUser.email,
      avatar: mockUser.avatar,
      name: mockUser.name,
    });
  });

  it("should handle database errors", async () => {
    vi.mocked(prisma.user.findUnique).mockRejectedValueOnce(
      new Error("DB error")
    );

    await verify("", "", mockProfile as Profile, mockDone);
    expect(mockDone).toHaveBeenCalledWith(expect.any(Error));
    expect(mockDone.mock.calls[0][0].message).toBe("DB error");
  });
});
