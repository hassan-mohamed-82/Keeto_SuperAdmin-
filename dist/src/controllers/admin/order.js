"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrdersByRestaurant = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../models/schema");
const response_1 = require("../../utils/response");
const connection_1 = require("../../models/connection");
const getOrdersByRestaurant = async (req, res) => {
    const { restaurantId } = req.params; // الأيدي بتاع المطعم اللي باعتينه في اللينك
    const { status } = req.query; // لو عايز تفلتر بـ Pending أو Delivered مثلاً
    // بناء الكويري بشكل ديناميكي
    const baseQuery = connection_1.db
        .select({
        orderId: schema_1.orders.orderNumber, // الرقم العشوائي (ORD-123)
        internalId: schema_1.orders.id,
        orderDate: schema_1.orders.createdAt,
        totalAmount: schema_1.orders.totalAmount,
        orderStatus: schema_1.orders.status,
        customerName: schema_1.users.name, // اسم العميل من جدول اليوزرز
        customerPhone: schema_1.users.phone
    })
        .from(schema_1.orders)
        .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.orders.userId, schema_1.users.id)); // ربطنا الأوردر باليوزر
    // لو الأدمن داس على تابة معينة (مثلاً Pending فقط)
    let condition = (0, drizzle_orm_1.eq)(schema_1.orders.restaurantId, restaurantId);
    if (status) {
        condition = (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.orders.restaurantId, restaurantId), (0, drizzle_orm_1.eq)(schema_1.orders.status, status));
    }
    const result = await baseQuery.where(condition).orderBy((0, drizzle_orm_1.desc)(schema_1.orders.createdAt));
    return (0, response_1.SuccessResponse)(res, {
        message: "تم جلب طلبات المطعم بنجاح",
        data: result
    });
};
exports.getOrdersByRestaurant = getOrdersByRestaurant;
