"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPolicies = exports.getPolicy = exports.deletePolicy = exports.updatePolicy = exports.createPolicy = void 0;
const connection_1 = require("../../models/connection");
const schema_1 = require("../../models/schema");
const drizzle_orm_1 = require("drizzle-orm");
const response_1 = require("../../utils/response");
const Errors_1 = require("../../Errors");
const createPolicy = async (req, res) => {
    const { title, description, type } = req.body;
    if (!title || !description || !type) {
        throw new Errors_1.BadRequest("Missing required fields");
    }
    const [polic] = await connection_1.db.insert(schema_1.policy).values({
        title: title,
        desctription: description,
        type: type || "Keto",
    });
    return (0, response_1.SuccessResponse)(res, { data: polic });
};
exports.createPolicy = createPolicy;
const updatePolicy = async (req, res) => {
    const { id, title, description, type } = req.body;
    if (!title || !description || !type) {
        throw new Errors_1.BadRequest("Missing required fields");
    }
    const [polic] = await connection_1.db.update(schema_1.policy).set({
        title: title,
        desctription: description,
        type: type,
    }).where((0, drizzle_orm_1.eq)(schema_1.policy.id, id));
    return (0, response_1.SuccessResponse)(res, { data: polic });
};
exports.updatePolicy = updatePolicy;
const deletePolicy = async (req, res) => {
    const { id } = req.body;
    if (!id) {
        throw new Errors_1.BadRequest("Missing required fields");
    }
    const [polic] = await connection_1.db.delete(schema_1.policy).where((0, drizzle_orm_1.eq)(schema_1.policy.id, id));
    return (0, response_1.SuccessResponse)(res, { data: polic });
};
exports.deletePolicy = deletePolicy;
const getPolicy = async (req, res) => {
    const { id } = req.params;
    const [polic] = await connection_1.db.select().from(schema_1.policy).where((0, drizzle_orm_1.eq)(schema_1.policy.id, id));
    return (0, response_1.SuccessResponse)(res, { data: polic });
};
exports.getPolicy = getPolicy;
const getPolicies = async (req, res) => {
    const policies = await connection_1.db.select().from(schema_1.policy);
    return (0, response_1.SuccessResponse)(res, { data: policies });
};
exports.getPolicies = getPolicies;
