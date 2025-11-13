import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { userTable } from "./index.js";  // ❌ This line causes a circular import

export const urlsTable = pgTable("urls", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),

  shortCode: varchar("code", { length: 155 }).notNull().unique(),
  targetUrl: text("target_url").notNull(),

  userId: uuid("user_id")
    .references(() => userTable.id)
    .notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
