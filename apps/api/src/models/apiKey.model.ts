import { and, eq, isNull, inArray } from "drizzle-orm";
import { db } from "../db";
import { apiKeys } from "../db/schema";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type ApiKey = InferSelectModel<typeof apiKeys>;
export type NewApiKey = InferInsertModel<typeof apiKeys>;

export type SafeApiKey = Omit<ApiKey, "keyHash">;

export async function createApiKey(
  userId: string,
  name: string,
  keyHash: string,
  keyPrefix: string,
  expiresAt?: Date,
): Promise<SafeApiKey> {
  const [created] = await db
    .insert(apiKeys)
    .values({ userId, name, keyHash, keyPrefix, expiresAt })
    .returning();
  const { keyHash: _stripped, ...safe } = created!;
  return safe;
}

export async function revokeApiKey(
  userId: string,
  id: string,
): Promise<SafeApiKey | undefined> {
  const [revoked] = await db
    .update(apiKeys)
    .set({ revokedAt: new Date() })
    .where(and(eq(apiKeys.userId, userId), eq(apiKeys.id, id)))
    .returning();
  if (!revoked) return undefined;
  const { keyHash: _stripped, ...safe } = revoked;
  return safe;
}

export async function bulkRevokeApiKeys(
  userId: string,
  ids: string[],
): Promise<SafeApiKey[]> {
  if (ids.length === 0) return [];
  const revoked = await db
    .update(apiKeys)
    .set({ revokedAt: new Date() })
    .where(and(eq(apiKeys.userId, userId), inArray(apiKeys.id, ids)))
    .returning();
  return revoked.map(({ keyHash: _stripped, ...safe }) => safe);
}

/** Bump lastUsedAt after a successful authentication. */
export async function touchApiKey(id: string): Promise<void> {
  await db
    .update(apiKeys)
    .set({ lastUsedAt: new Date() })
    .where(eq(apiKeys.id, id));
}

// ─── Reads ────────────────────────────────────────────────────────────────────

/**
 * Look up a key by its SHA-256 hash.
 * Returns undefined when:
 *   - the hash doesn't exist
 *   - the key has been revoked
 *   - the key has passed its expiresAt date
 */
export async function findApiKeyByHash(
  keyHash: string,
): Promise<ApiKey | undefined> {
  const key = await db.query.apiKeys.findFirst({
    where: and(eq(apiKeys.keyHash, keyHash), isNull(apiKeys.revokedAt)),
  });

  if (!key) return undefined;

  // Honour optional expiry
  if (key.expiresAt && key.expiresAt < new Date()) return undefined;

  return key;
}

/** List all non-revoked keys for a user (safe — no hash exposed). */
export async function listApiKeysByUser(userId: string): Promise<SafeApiKey[]> {
  const rows = await db.query.apiKeys.findMany({
    where: and(eq(apiKeys.userId, userId), isNull(apiKeys.revokedAt)),
  });
  return rows.map(({ keyHash: _stripped, ...safe }) => safe);
}
