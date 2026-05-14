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

export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  skills: many(skills),
  awards: many(awards),
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
