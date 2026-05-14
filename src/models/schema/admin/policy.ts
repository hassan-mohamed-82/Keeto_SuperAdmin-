import {
    mysqlTable,
    varchar,
    timestamp,
    mysqlEnum,
    json,
    char,
    text
, longtext } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
export const policy = mysqlTable("policy", {
    id: char("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
    title:varchar("title", { length: 255 }).notNull(),
    desctription:varchar("desctription", {length:255}).notNull(),
    type: mysqlEnum("type", ["restaurant","Keto"]).default("Keto"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});