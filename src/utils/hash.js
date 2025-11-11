import { randomBytes, createHmac } from "crypto";

/**
 * Hashes a password with a salt (creates one if not provided)
 * @param {string} password - The plain text password
 * @param {string} [userSalt] - Optional existing salt (for login check)
 * @returns {{ salt: string, hashedPassword: string }}
 */
 function hashedPasswordWithSalt(password, userSalt = undefined) {
  // Use existing salt if provided, otherwise create a new one
  const salt = userSalt ?? randomBytes(16).toString("hex");

  // Create HMAC SHA-256 hash of password with salt
  const hashedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  return { salt, hashedPassword };
}

export {hashedPasswordWithSalt}
