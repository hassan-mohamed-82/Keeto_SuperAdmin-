"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleAdoneStatus = exports.deleteAdone = exports.updateAdone = exports.getAdoneById = exports.getAllAdones = exports.createAdone = void 0;
const connection_1 = require("../../models/connection");
const schema_1 = require("../../models/schema");
const drizzle_orm_1 = require("drizzle-orm");
const response_1 = require("../../utils/response");
const NotFound_1 = require("../../Errors/NotFound");
const BadRequest_1 = require("../../Errors/BadRequest");
const uuid_1 = require("uuid");
const createAdone = async (req, res) => {
    const { name, status } = req.body;
    if (!name) {
        throw new BadRequest_1.BadRequest("Adone name is required");
    }
    const existingAdone = await connection_1.db
        .select()
        .from(schema_1.adonescategory)
        .where((0, drizzle_orm_1.eq)(schema_1.adonescategory.name, name));
    if (existingAdone.length > 0) {
        throw new BadRequest_1.BadRequest("Adone already exists");
    }
    const id = (0, uuid_1.v4)();
    await connection_1.db.insert(schema_1.adonescategory).values({
        id,
        name,
        status: status || "active",
    });
    return (0, response_1.SuccessResponse)(res, { message: "create adone success", data: { id } });
};
exports.createAdone = createAdone;
const getAllAdones = async (req, res) => {
    const allAdones = await connection_1.db
        .select({
        id: schema_1.adonescategory.id,
        name: schema_1.adonescategory.name,
        status: schema_1.adonescategory.status,
        createdAt: schema_1.adonescategory.createdAt,
        updatedAt: schema_1.adonescategory.updatedAt,
    })
        .from(schema_1.adonescategory);
    return (0, response_1.SuccessResponse)(res, { message: "get all adones success", data: allAdones });
};
exports.getAllAdones = getAllAdones;
const getAdoneById = async (req, res) => {
    const { id } = req.params;
    const adone = await connection_1.db
        .select({
        id: schema_1.adonescategory.id,
        name: schema_1.adonescategory.name,
        status: schema_1.adonescategory.status,
        createdAt: schema_1.adonescategory.createdAt,
        updatedAt: schema_1.adonescategory.updatedAt,
    })
        .from(schema_1.adonescategory)
        .where((0, drizzle_orm_1.eq)(schema_1.adonescategory.id, id));
    if (adone.length === 0) {
        throw new NotFound_1.NotFound("Adone not found");
    }
    return (0, response_1.SuccessResponse)(res, { message: "get adone by id success", data: adone[0] });
};
exports.getAdoneById = getAdoneById;
const updateAdone = async (req, res) => {
    const { id } = req.params;
    const { name, status } = req.body;
    const existingAdone = await connection_1.db
        .select()
        .from(schema_1.adonescategory)
        .where((0, drizzle_orm_1.eq)(schema_1.adonescategory.id, id));
    if (existingAdone.length === 0) {
        throw new NotFound_1.NotFound("Adone not found");
    }
    const updateData = {
        updatedAt: new Date()
    };
    if (name)
        updateData.name = name;
    if (status)
        updateData.status = status;
    if (Object.keys(updateData).length === 1) {
        throw new BadRequest_1.BadRequest("no data to update");
    }
    await connection_1.db
        .update(schema_1.adonescategory)
        .set(updateData)
        .where((0, drizzle_orm_1.eq)(schema_1.adonescategory.id, id));
    return (0, response_1.SuccessResponse)(res, { message: "update adone success" });
};
exports.updateAdone = updateAdone;
const deleteAdone = async (req, res) => {
    const { id } = req.params;
    const adone = await connection_1.db
        .select()
        .from(schema_1.adonescategory)
        .where((0, drizzle_orm_1.eq)(schema_1.adonescategory.id, id));
    if (adone.length === 0) {
        throw new NotFound_1.NotFound("Adone not found");
    }
    await connection_1.db.delete(schema_1.adonescategory).where((0, drizzle_orm_1.eq)(schema_1.adonescategory.id, id));
    return (0, response_1.SuccessResponse)(res, { message: "delete adone success" });
};
exports.deleteAdone = deleteAdone;
const toggleAdoneStatus = async (req, res) => {
    const { id } = req.params;
    const adone = await connection_1.db
        .select()
        .from(schema_1.adonescategory)
        .where((0, drizzle_orm_1.eq)(schema_1.adonescategory.id, id));
    if (adone.length === 0) {
        throw new NotFound_1.NotFound("Adone not found");
    }
    const newStatus = adone[0].status === "active" ? "inactive" : "active";
    await connection_1.db
        .update(schema_1.adonescategory)
        .set({
        status: newStatus,
        updatedAt: new Date()
    })
        .where((0, drizzle_orm_1.eq)(schema_1.adonescategory.id, id));
    return (0, response_1.SuccessResponse)(res, { message: `toggle adone status success` });
};
exports.toggleAdoneStatus = toggleAdoneStatus;
