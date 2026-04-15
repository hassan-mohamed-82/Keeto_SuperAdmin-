import {
    mysqlTable,
    varchar,
    timestamp,
    mysqlEnum,
    json,
    char,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { number } from "zod";

export const addresses = mysqlTable("addresses", {
    id: char("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
    userId: char("user_id", { length: 36 }).notNull(),
    type: mysqlEnum("type", ["home", "work", "other"]).default("home"),
    title: varchar("title", { length: 255 }).notNull(),
    street: varchar("street", { length: 255 }).notNull(),
    number: varchar("number", { length: 20 }).notNull(),
    floor: varchar("floor", { length: 20 }),
});