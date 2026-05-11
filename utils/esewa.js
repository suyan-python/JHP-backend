import crypto from "crypto";

export const generateEsewaSignature = (message, secret) => {
  return crypto.createHmac("sha256", secret).update(message).digest("base64");
};
