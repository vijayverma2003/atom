export const validOrigins = ["http://localhost:3000", "http://localhost:3001"];

export function toOrigin(url?: string) {
  if (!url) return "";

  try {
    return new URL(url).origin;
  } catch (error) {
    return "";
  }
}

export const isValidOrigin = (o: string) =>
  o !== "" && validOrigins.includes(o);
