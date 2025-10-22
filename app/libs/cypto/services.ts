// Simple encode
export function encodeWithSecret(data: string, secret: string): string {
  // Just append the secret and base64 encode
  return Buffer.from(data + secret, "utf8").toString("base64");
}

// Simple decode
export function decodeWithSecret(encoded: string, secret: string): string {
  const decoded = Buffer.from(encoded, "base64").toString("utf8");
  // Remove the secret from the end
  if (!decoded.endsWith(secret)) throw new Error("Invalid secret");
  return decoded.slice(0, -secret.length);
}
