"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKetoPoliciesById = exports.deleteKetoPolicy = exports.getKetoPolicies = exports.updateKetoPolicy = exports.createKetoPolicy = void 0;
const connection_1 = require("../../models/connection");
const schema_1 = require("../../models/schema");
const drizzle_orm_1 = require("drizzle-orm");
const response_1 = require("../../utils/response");
const Errors_1 = require("../../Errors");
const createKetoPolicy = async (req, res) => {
    const { title, description } = req.body;
    if (!title || !description) {
        throw new Errors_1.BadRequest("Missing required fields");
    }
    const [newPolicy] = await connection_1.db
        .insert(schema_1.policy)
        .values({
        title,
        description,
        type: "keto",
        restaurantId: null,
    });
    return (0, response_1.SuccessResponse)(res, {
        data: newPolicy,
    });
};
exports.createKetoPolicy = createKetoPolicy;
const updateKetoPolicy = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    await connection_1.db
        .update(schema_1.policy)
        .set({
        title,
        description,
        updatedAt: new Date(),
    })
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.policy.id, id), (0, drizzle_orm_1.eq)(schema_1.policy.type, "keto")));
    return (0, response_1.SuccessResponse)(res, {
        message: "Keto policy updated",
    });
};
exports.updateKetoPolicy = updateKetoPolicy;
const getKetoPolicies = async (req, res) => {
    const policies = await connection_1.db
        .select()
        .from(schema_1.policy)
        .where((0, drizzle_orm_1.eq)(schema_1.policy.type, "keto"));
    return (0, response_1.SuccessResponse)(res, {
        data: policies,
    });
};
exports.getKetoPolicies = getKetoPolicies;
const deleteKetoPolicy = async (req, res) => {
    const { id } = req.params;
    await connection_1.db
        .delete(schema_1.policy)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.policy.id, id), (0, drizzle_orm_1.eq)(schema_1.policy.type, "keto")));
    return (0, response_1.SuccessResponse)(res, {
        message: "Keto policy deleted",
    });
};
exports.deleteKetoPolicy = deleteKetoPolicy;
const getKetoPoliciesById = async (req, res) => {
    const { id } = req.params;
    const policies = await connection_1.db
        .select()
        .from(schema_1.policy)
        .where((0, drizzle_orm_1.eq)(schema_1.policy.id, id));
    return (0, response_1.SuccessResponse)(res, {
        data: policies,
    });
};
exports.getKetoPoliciesById = getKetoPoliciesById;
