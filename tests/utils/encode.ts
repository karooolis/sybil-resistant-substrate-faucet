import { EncryptJWT, JWTPayload } from "jose";
import { getDerivedEncryptionKey } from "./getDerivedEncryptionKey";

// Function logic derived from https://github.com/nextauthjs/next-auth/blob/5c1826a8d1f8d8c2d26959d12375704b0a693bfc/packages/next-auth/src/jwt/index.ts#L16-L25
export const encode = async (
  token: JWTPayload,
  secret: string
): Promise<string> => {
  const maxAge = 30 * 24 * 60 * 60; // 30 days
  const encryptionSecret = await getDerivedEncryptionKey(secret);
  return await new EncryptJWT(token)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime(Math.round(Date.now() / 1000 + maxAge))
    .setJti("test")
    .encrypt(encryptionSecret);
};

export default encode;
