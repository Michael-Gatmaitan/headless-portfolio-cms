import { relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, uuid } from "drizzle-orm/pg-core";

export const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
};

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash"),
  ...timestamps,
});

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  thumbnail: varchar("thumbnail", { length: 255 }),
  description: varchar("description", { length: 255 }).notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  github: varchar("github", { length: 255 }).notNull(),
  dateRange: varchar("date_range", { length: 255 }).notNull(),
  ...timestamps,
  // Todo: Image placeholder

  // Todo: Images gallery for showcase
});

export const skills = pgTable("skills", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  tags: text("tags").array().notNull().default([]),
  ...timestamps,
});

export const awards = pgTable("awards", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  thumbnail: varchar("thumbnail", { length: 255 }),
  shortDescription: varchar("short_description").notNull(),
  longDescription: varchar("long_description").notNull(),
  year: text("year").notNull(),
  tags: text("tags").array().notNull().default([]),
  ...timestamps,
  // Todo: Image placeholder
});

export const apiKeys = pgTable("api_keys", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(), // e.g. "My Portfolio Site"
  keyHash: text("key_hash").notNull().unique(), // SHA-256 of the raw key
  keyPrefix: varchar("key_prefix", { length: 12 }).notNull(), // first 8 chars for display (e.g. "pf_live_a")
  lastUsedAt: timestamp("last_used_at"),
  expiresAt: timestamp("expires_at"),
  revokedAt: timestamp("revoked_at"), // soft delete
  ...timestamps,
});

export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  skills: many(skills),
  awards: many(awards),
  apiKeys: many(apiKeys),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  user: one(users, { fields: [projects.userId], references: [users.id] }),
}));

export const skillsRelations = relations(skills, ({ one }) => ({
  user: one(users, { fields: [skills.userId], references: [users.id] }),
}));

export const awardsRelations = relations(awards, ({ one }) => ({
  user: one(users, { fields: [awards.userId], references: [users.id] }),
}));

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  user: one(users, { fields: [apiKeys.userId], references: [users.id] }),
}));
