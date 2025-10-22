import crypto from "crypto";

const algorithm = "aes-256-cbc"; // AES encryption
const IV_LENGTH = 16; // AES block size

// Encode function
export function encodeWithSecret(data: string, secretKey: string): string {
  const key = crypto.createHash("sha256").update(secretKey).digest(); // ensure 32 bytes
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(data, "utf8"), cipher.final()]);

  // Return iv + encrypted as base64
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

// Decode function
export function decodeWithSecret(encoded: string, secretKey: string): string {
  const [ivHex, encryptedHex] = encoded.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");
  const key = crypto.createHash("sha256").update(secretKey).digest();
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
}
