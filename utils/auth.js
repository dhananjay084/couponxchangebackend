import crypto from "crypto";

const TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET || "couponxchange-dev-secret";
const TOKEN_EXPIRES_IN_SECONDS = 60 * 60 * 24 * 7; // 7 days

const toBase64Url = (value) => Buffer.from(value).toString("base64url");
const fromBase64Url = (value) => Buffer.from(value, "base64url").toString("utf-8");

export const hashPassword = (password, salt) => {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
};

export const createPasswordHash = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const passwordHash = hashPassword(password, salt);
  return { passwordSalt: salt, passwordHash };
};

export const generateAuthToken = (user) => {
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    sub: String(user._id),
    role: user.role,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRES_IN_SECONDS,
  };

  const encodedHeader = toBase64Url(JSON.stringify(header));
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const unsigned = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto.createHmac("sha256", TOKEN_SECRET).update(unsigned).digest("base64url");
  return `${unsigned}.${signature}`;
};

export const verifyAuthToken = (token) => {
  const parts = String(token || "").split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid token format");
  }

  const [encodedHeader, encodedPayload, providedSignature] = parts;
  const unsigned = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = crypto
    .createHmac("sha256", TOKEN_SECRET)
    .update(unsigned)
    .digest("base64url");

  if (providedSignature !== expectedSignature) {
    throw new Error("Invalid token signature");
  }

  const payload = JSON.parse(fromBase64Url(encodedPayload));
  if (!payload?.sub || !payload?.exp || !payload?.role) {
    throw new Error("Invalid token payload");
  }

  if (payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Token expired");
  }

  return payload;
};
