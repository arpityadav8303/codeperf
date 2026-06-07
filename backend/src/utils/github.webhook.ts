import crypto from "crypto";

export function verifyGithubSignature(secret: string, rawBody: Buffer, signature: string): boolean {
    const expected = "sha256=" + crypto
        .createHmac("sha256", secret)
        .update(rawBody)
        .digest("hex");

    // Timing-safe comparison — prevents timing attacks
    return crypto.timingSafeEqual( Buffer.from(expected),Buffer.from(signature) );
}