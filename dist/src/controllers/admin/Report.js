"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFinancialReport = void 0;
const connection_1 = require("../../models/connection");
const schema_1 = require("../../models/schema");
const drizzle_orm_1 = require("drizzle-orm");
const response_1 = require("../../utils/response");
const Errors_1 = require("../../Errors");
const getFinancialReport = async (req, res) => {
    if (!req.user)
        throw new Errors_1.UnauthorizedError("Unauthenticated");
    const { restaurantId, startDate, endDate, status, paymentMethod } = req.query;
    const conditions = [];
    if (restaurantId) {
        conditions.push((0, drizzle_orm_1.eq)(schema_1.orders.restaurantId, restaurantId));
    }
    // 👇 التعديل هنا: استخدام الأنواع اللي عرفناها فوق بدل as string
    if (status) {
        conditions.push((0, drizzle_orm_1.eq)(schema_1.orders.status, status));
    }
    if (paymentMethod) {
        conditions.push((0, drizzle_orm_1.eq)(schema_1.orders.paymentMethod, paymentMethod));
    }
    // 👆
    if (startDate) {
        conditions.push((0, drizzle_orm_1.gte)(schema_1.orders.createdAt, new Date(startDate)));
    }
    if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        conditions.push((0, drizzle_orm_1.lte)(schema_1.orders.createdAt, end));
    }
    // ... باقي الكود زي ما هو بدون تعديل ...
    const reportData = await connection_1.db
        .select({
        orderId: schema_1.orders.id,
        orderNumber: schema_1.orders.orderNumber,
        status: schema_1.orders.status,
        paymentMethod: schema_1.orders.paymentMethod,
        orderType: schema_1.orders.orderType,
        subtotal: schema_1.orders.subtotal,
        deliveryFee: schema_1.orders.deliveryFee,
        serviceFee: schema_1.orders.serviceFee,
        appCommission: schema_1.orders.appCommission,
        totalAmount: schema_1.orders.totalAmount,
        createdAt: schema_1.orders.createdAt,
        restaurantId: schema_1.restaurants.id,
        restaurantName: schema_1.restaurants.name,
    })
        .from(schema_1.orders)
        .leftJoin(schema_1.restaurants, (0, drizzle_orm_1.eq)(schema_1.orders.restaurantId, schema_1.restaurants.id))
        .where(conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined)
        .orderBy((0, drizzle_orm_1.desc)(schema_1.orders.createdAt));
    let totalRevenue = 0;
    let totalAppCommission = 0;
    let totalCashCollected = 0;
    let totalDigitalCollected = 0;
    let totalDeliveredOrders = 0;
    let totalCancelledOrders = 0;
    reportData.forEach((order) => {
        const amount = parseFloat(order.totalAmount || "0");
        const commission = parseFloat(order.appCommission || "0");
        if (order.status === "delivered") {
            totalRevenue += amount;
            totalAppCommission += commission;
            totalDeliveredOrders += 1;
            if (order.paymentMethod === "cash_on_delivery") {
                totalCashCollected += amount;
            }
            else {
                totalDigitalCollected += amount;
            }
        }
        else if (order.status === "cancelled" || order.status === "rejected") {
            totalCancelledOrders += 1;
        }
    });
    const summary = {
        totalOrders: reportData.length,
        totalDeliveredOrders,
        totalCancelledOrders,
        financials: {
            totalRevenue: totalRevenue.toFixed(2),
            totalAppCommission: totalAppCommission.toFixed(2),
            totalCashCollected: totalCashCollected.toFixed(2),
            totalDigitalCollected: totalDigitalCollected.toFixed(2),
        }
    };
    return (0, response_1.SuccessResponse)(res, {
        message: "Financial report generated successfully",
        data: {
            summary,
            orders: reportData
        }
    });
};
exports.getFinancialReport = getFinancialReport;
