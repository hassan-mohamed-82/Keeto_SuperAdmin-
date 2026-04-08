"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categories = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.categories = (0, mysql_core_1.mysqlTable)("categories", {
    id: (0, mysql_core_1.char)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    name: (0, mysql_core_1.varchar)("name", { length: 255 }).notNull(),
    Image: (0, mysql_core_1.varchar)("image", { length: 255 }).notNull(),
    meta_image: (0, mysql_core_1.varchar)("meta_image", { length: 255 }),
    title: (0, mysql_core_1.text)("title"),
    meta_title: (0, mysql_core_1.text)("meta_title"),
    priority: (0, mysql_core_1.mysqlEnum)("priority", ["low", "medium", "high"]).default("low"),
    status: (0, mysql_core_1.mysqlEnum)("status", ["active", "inactive"]).default("active"),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at").defaultNow().onUpdateNow(),
});
