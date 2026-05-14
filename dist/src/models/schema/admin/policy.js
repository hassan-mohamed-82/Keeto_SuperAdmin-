"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.policy = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.policy = (0, mysql_core_1.mysqlTable)("policy", {
    id: (0, mysql_core_1.char)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    title: (0, mysql_core_1.varchar)("title", { length: 255 }).notNull(),
    desctription: (0, mysql_core_1.varchar)("desctription", { length: 255 }).notNull(),
    type: (0, mysql_core_1.mysqlEnum)("type", ["restaurant", "Keto"]).default("Keto"),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at").defaultNow().onUpdateNow(),
});
