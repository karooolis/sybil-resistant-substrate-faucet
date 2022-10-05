import hkdf from "@panva/hkdf";

export const getDerivedEncryptionKey = async (secret: string) => {
  return await hkdf(
    "sha256",
    secret,
    "",
    "NextAuth.js Generated Encryption Key",
    32
  );
};

export default getDerivedEncryptionKey;
