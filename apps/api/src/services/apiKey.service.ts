import { randomBytes, createHash } from "crypto";
import * as ApiKeyModel from "../models/apiKey.model";

// ─── Key Generation ───────────────────────────────────────────────────────────

/**
 * Creates a new API key.
 *
 * @returns `raw`    – The full plaintext key (show this to the user ONCE, then discard).
 *          `hash`   – SHA-256 of the raw key (store this in the DB).
 *          `prefix` – First 12 chars of the raw key (safe to show in the UI forever).
 */
function generateApiKey(): { raw: string; hash: string; prefix: string } {
  const randomPart = randomBytes(32).toString("hex"); // 64 hex chars
  const raw = `pf_live_${randomPart}`;
  const hash = createHash("sha256").update(raw).digest("hex");
  const prefix = raw.slice(0, 12); // "pf_live_xxxx"
  return { raw, hash, prefix };
}

/** SHA-256 a raw incoming key — used in the middleware to look it up. */
export function hashApiKey(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

// ─── Service Functions ────────────────────────────────────────────────────────

export async function createKey(
  userId: string,
  name: string,
  expiresAt?: Date,
) {
  const { raw, hash, prefix } = generateApiKey();
  const saved = await ApiKeyModel.createApiKey(userId, name, hash, prefix, expiresAt);
  // Return the raw key alongside the safe DB record — this is the ONLY time
  // the raw key is surfaced.
  return { key: raw, ...saved };
}

export async function listKeys(userId: string) {
  return ApiKeyModel.listApiKeysByUser(userId);
}

export async function revokeKey(userId: string, id: string) {
  return ApiKeyModel.revokeApiKey(userId, id);
}

export async function bulkRevokeKeys(userId: string, ids: string[]) {
  return ApiKeyModel.bulkRevokeApiKeys(userId, ids);
}


export async function verifyApiKey(raw: string) {
  const hash = hashApiKey(raw);
  const keyRow = await ApiKeyModel.findApiKeyByHash(hash);
  if (!keyRow) return null;
  // Fire-and-forget — don't await so the request isn't slowed down
  ApiKeyModel.touchApiKey(keyRow.id).catch(() => {});
  return keyRow;
}
