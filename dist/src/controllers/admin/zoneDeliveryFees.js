"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getallzone = exports.deleteZoneDeliveryFee = exports.updateZoneDeliveryFee = exports.getZoneDeliveryFeeById = exports.getAllZoneDeliveryFees = exports.createZoneDeliveryFee = void 0;
const connection_1 = require("../../models/connection");
const schema_1 = require("../../models/schema");
const drizzle_orm_1 = require("drizzle-orm");
const mysql_core_1 = require("drizzle-orm/mysql-core");
const response_1 = require("../../utils/response");
const NotFound_1 = require("../../Errors/NotFound");
const BadRequest_1 = require("../../Errors/BadRequest");
const uuid_1 = require("uuid");
// ==========================================
// 1. إنشاء تسعيرة شحن بين منطقتين
// ==========================================
const createZoneDeliveryFee = async (req, res) => {
    const { fromZoneId, toZoneId, fee } = req.body;
    if (!fromZoneId || !toZoneId || !fee) {
        throw new BadRequest_1.BadRequest("Missing required fields: fromZoneId, toZoneId, fee");
    }
    // التأكد من وجود المناطق
    const fromZone = await connection_1.db.select().from(schema_1.zones).where((0, drizzle_orm_1.eq)(schema_1.zones.id, fromZoneId)).limit(1);
    if (!fromZone[0])
        throw new BadRequest_1.BadRequest("fromZoneId not found");
    const toZone = await connection_1.db.select().from(schema_1.zones).where((0, drizzle_orm_1.eq)(schema_1.zones.id, toZoneId)).limit(1);
    if (!toZone[0])
        throw new BadRequest_1.BadRequest("toZoneId not found");
    // التأكد من عدم وجود تسعيرة مسبقة لنفس المنطقتين
    const existingFee = await connection_1.db.select().from(schema_1.zoneDeliveryFees)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.zoneDeliveryFees.fromZoneId, fromZoneId), (0, drizzle_orm_1.eq)(schema_1.zoneDeliveryFees.toZoneId, toZoneId)))
        .limit(1);
    if (existingFee[0]) {
        throw new BadRequest_1.BadRequest("Delivery fee between these zones already exists");
    }
    const id = (0, uuid_1.v4)();
    await connection_1.db.insert(schema_1.zoneDeliveryFees).values({
        id,
        fromZoneId,
        toZoneId,
        fee: fee.toString()
    });
    return (0, response_1.SuccessResponse)(res, { message: "Zone delivery fee created successfully", data: { id } }, 201);
};
exports.createZoneDeliveryFee = createZoneDeliveryFee;
// ==========================================
// 2. جلب جميع التسعيرات مع تفاصيل المناطق
// ==========================================
const getAllZoneDeliveryFees = async (req, res) => {
    const fromZ = (0, mysql_core_1.alias)(schema_1.zones, "fromZone");
    const toZ = (0, mysql_core_1.alias)(schema_1.zones, "toZone");
    const allFees = await connection_1.db
        .select({
        id: schema_1.zoneDeliveryFees.id,
        fromZoneId: schema_1.zoneDeliveryFees.fromZoneId,
        toZoneId: schema_1.zoneDeliveryFees.toZoneId,
        fee: schema_1.zoneDeliveryFees.fee,
        createdAt: schema_1.zoneDeliveryFees.createdAt,
        updatedAt: schema_1.zoneDeliveryFees.updatedAt,
        fromZoneName: fromZ.name,
        toZoneName: toZ.name
    })
        .from(schema_1.zoneDeliveryFees)
        .leftJoin(fromZ, (0, drizzle_orm_1.eq)(schema_1.zoneDeliveryFees.fromZoneId, fromZ.id))
        .leftJoin(toZ, (0, drizzle_orm_1.eq)(schema_1.zoneDeliveryFees.toZoneId, toZ.id));
    return (0, response_1.SuccessResponse)(res, { message: "Fetch all zone delivery fees success", data: allFees });
};
exports.getAllZoneDeliveryFees = getAllZoneDeliveryFees;
// ==========================================
// 3. جلب تسعيرة برقم الـ ID
// ==========================================
const getZoneDeliveryFeeById = async (req, res) => {
    const { id } = req.params;
    const fromZ = (0, mysql_core_1.alias)(schema_1.zones, "fromZone");
    const toZ = (0, mysql_core_1.alias)(schema_1.zones, "toZone");
    const feeRecord = await connection_1.db
        .select({
        id: schema_1.zoneDeliveryFees.id,
        fromZoneId: schema_1.zoneDeliveryFees.fromZoneId,
        toZoneId: schema_1.zoneDeliveryFees.toZoneId,
        fee: schema_1.zoneDeliveryFees.fee,
        createdAt: schema_1.zoneDeliveryFees.createdAt,
        updatedAt: schema_1.zoneDeliveryFees.updatedAt,
        fromZoneName: fromZ.name,
        toZoneName: toZ.name
    })
        .from(schema_1.zoneDeliveryFees)
        .leftJoin(fromZ, (0, drizzle_orm_1.eq)(schema_1.zoneDeliveryFees.fromZoneId, fromZ.id))
        .leftJoin(toZ, (0, drizzle_orm_1.eq)(schema_1.zoneDeliveryFees.toZoneId, toZ.id))
        .where((0, drizzle_orm_1.eq)(schema_1.zoneDeliveryFees.id, id))
        .limit(1);
    if (!feeRecord[0]) {
        throw new NotFound_1.NotFound("Zone delivery fee not found");
    }
    return (0, response_1.SuccessResponse)(res, { message: "Fetch zone delivery fee success", data: feeRecord[0] });
};
exports.getZoneDeliveryFeeById = getZoneDeliveryFeeById;
// ==========================================
// 4. تحديث التسعيرة
// ==========================================
const updateZoneDeliveryFee = async (req, res) => {
    const { id } = req.params;
    const { fromZoneId, toZoneId, fee } = req.body;
    const existingFee = await connection_1.db.select().from(schema_1.zoneDeliveryFees).where((0, drizzle_orm_1.eq)(schema_1.zoneDeliveryFees.id, id)).limit(1);
    if (!existingFee[0]) {
        throw new NotFound_1.NotFound("Zone delivery fee not found");
    }
    const updateData = { updatedAt: new Date() };
    if (fromZoneId) {
        const fromZone = await connection_1.db.select().from(schema_1.zones).where((0, drizzle_orm_1.eq)(schema_1.zones.id, fromZoneId)).limit(1);
        if (!fromZone[0])
            throw new BadRequest_1.BadRequest("fromZoneId not found");
        updateData.fromZoneId = fromZoneId;
    }
    if (toZoneId) {
        const toZone = await connection_1.db.select().from(schema_1.zones).where((0, drizzle_orm_1.eq)(schema_1.zones.id, toZoneId)).limit(1);
        if (!toZone[0])
            throw new BadRequest_1.BadRequest("toZoneId not found");
        updateData.toZoneId = toZoneId;
    }
    if (fee)
        updateData.fee = fee.toString();
    // التأكد من عدم تكرار التسعيرة بعد التعديل
    if (updateData.fromZoneId || updateData.toZoneId) {
        const checkFrom = updateData.fromZoneId || existingFee[0].fromZoneId;
        const checkTo = updateData.toZoneId || existingFee[0].toZoneId;
        const duplicateCheck = await connection_1.db.select().from(schema_1.zoneDeliveryFees)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.zoneDeliveryFees.fromZoneId, checkFrom), (0, drizzle_orm_1.eq)(schema_1.zoneDeliveryFees.toZoneId, checkTo)))
            .limit(1);
        if (duplicateCheck[0] && duplicateCheck[0].id !== id) {
            throw new BadRequest_1.BadRequest("Delivery fee between these zones already exists");
        }
    }
    await connection_1.db.update(schema_1.zoneDeliveryFees).set(updateData).where((0, drizzle_orm_1.eq)(schema_1.zoneDeliveryFees.id, id));
    return (0, response_1.SuccessResponse)(res, { message: "Zone delivery fee updated successfully" });
};
exports.updateZoneDeliveryFee = updateZoneDeliveryFee;
// ==========================================
// 5. مسح التسعيرة
// ==========================================
const deleteZoneDeliveryFee = async (req, res) => {
    const { id } = req.params;
    const existingFee = await connection_1.db.select().from(schema_1.zoneDeliveryFees).where((0, drizzle_orm_1.eq)(schema_1.zoneDeliveryFees.id, id)).limit(1);
    if (!existingFee[0]) {
        throw new NotFound_1.NotFound("Zone delivery fee not found");
    }
    await connection_1.db.delete(schema_1.zoneDeliveryFees).where((0, drizzle_orm_1.eq)(schema_1.zoneDeliveryFees.id, id));
    return (0, response_1.SuccessResponse)(res, { message: "Zone delivery fee deleted successfully" });
};
exports.deleteZoneDeliveryFee = deleteZoneDeliveryFee;
const getallzone = async (req, res) => {
    const allZones = await connection_1.db.select().from(schema_1.zones);
    return (0, response_1.SuccessResponse)(res, { message: "All zones fetched successfully", data: allZones });
};
exports.getallzone = getallzone;
