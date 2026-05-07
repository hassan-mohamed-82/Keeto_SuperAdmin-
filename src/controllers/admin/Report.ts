// controllers/admin/FinancialReportController.ts
import { Request, Response } from "express";
import { db } from "../../models/connection";
import { orders, restaurants } from "../../models/schema";
import { eq, and, desc, gte, lte } from "drizzle-orm";
import { SuccessResponse } from "../../utils/response";
import { UnauthorizedError } from "../../Errors";

// 1. تعريف الأنواع المسموحة للـ Enums
type OrderStatus = "pending" | "accepted" | "preparing" | "out_for_delivery" | "delivered" | "cancelled" | "rejected" | "refund";
type PaymentMethod = "cash_on_delivery" | "visa" | "wallet";

export const getFinancialReport = async (req: Request | any, res: Response) => {
    if (!req.user) throw new UnauthorizedError("Unauthenticated");

    const { restaurantId, startDate, endDate, status, paymentMethod } = req.query;

    const conditions = [];

    if (restaurantId) {
        conditions.push(eq(orders.restaurantId, restaurantId as string));
    }
    
    // 👇 التعديل هنا: استخدام الأنواع اللي عرفناها فوق بدل as string
    if (status) {
        conditions.push(eq(orders.status, status as OrderStatus)); 
    }
    if (paymentMethod) {
        conditions.push(eq(orders.paymentMethod, paymentMethod as PaymentMethod)); 
    }
    // 👆
    
    if (startDate) {
        conditions.push(gte(orders.createdAt, new Date(startDate as string)));
    }
    if (endDate) {
        const end = new Date(endDate as string);
        end.setHours(23, 59, 59, 999);
        conditions.push(lte(orders.createdAt, end));
    }

    // ... باقي الكود زي ما هو بدون تعديل ...
    const reportData = await db
        .select({
            orderId: orders.id,
            orderNumber: orders.orderNumber,
            status: orders.status,
            paymentMethod: orders.paymentMethod,
            orderType: orders.orderType,
            
            subtotal: orders.subtotal,
            deliveryFee: orders.deliveryFee,
            serviceFee: orders.serviceFee,
            appCommission: orders.appCommission,
            totalAmount: orders.totalAmount,
            
            createdAt: orders.createdAt,
            
            restaurantId: restaurants.id,
            restaurantName: restaurants.name,
        })
        .from(orders)
        .leftJoin(restaurants, eq(orders.restaurantId, restaurants.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(orders.createdAt));

    let totalRevenue = 0; 
    let totalAppCommission = 0; 
    let totalCashCollected = 0; 
    let totalDigitalCollected = 0; 
    let totalDeliveredOrders = 0;
    let totalCancelledOrders = 0;

    reportData.forEach((order) => {
        const amount = parseFloat(order.totalAmount as string || "0");
        const commission = parseFloat(order.appCommission as string || "0");

        if (order.status === "delivered") {
            totalRevenue += amount;
            totalAppCommission += commission;
            totalDeliveredOrders += 1;

            if (order.paymentMethod === "cash_on_delivery") {
                totalCashCollected += amount;
            } else {
                totalDigitalCollected += amount;
            }
        } else if (order.status === "cancelled" || order.status === "rejected") {
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

    return SuccessResponse(res, {
        message: "Financial report generated successfully",
        data: {
            summary,
            orders: reportData
        }
    });
};