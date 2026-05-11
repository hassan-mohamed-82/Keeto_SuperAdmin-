"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRestaurantRatings = exports.getRestaurantRatingStats = void 0;
const connection_1 = require("../../models/connection");
const schema_1 = require("../../models/schema");
const drizzle_orm_1 = require("drizzle-orm");
const response_1 = require("../../utils/response");
const NotFound_1 = require("../../Errors/NotFound");
// ==========================================
// 1. Get Restaurant Rating Stats (Admin)
// ==========================================
const getRestaurantRatingStats = async (req, res) => {
    const { restaurantId } = req.params;
    // تأكد المطعم موجود
    const [restaurant] = await connection_1.db.select({ id: schema_1.restaurants.id, name: schema_1.restaurants.name })
        .from(schema_1.restaurants).where((0, drizzle_orm_1.eq)(schema_1.restaurants.id, restaurantId)).limit(1);
    if (!restaurant)
        throw new NotFound_1.NotFound("Restaurant not found");
    // إجمالي عدد التقييمات ومتوسط التقييم
    const [stats] = await connection_1.db.select({
        totalRatings: (0, drizzle_orm_1.count)(schema_1.restaurantRatings.id),
        averageRating: (0, drizzle_orm_1.avg)(schema_1.restaurantRatings.rating),
    })
        .from(schema_1.restaurantRatings)
        .where((0, drizzle_orm_1.eq)(schema_1.restaurantRatings.restaurantId, restaurantId));
    // نسب كل نجمة (1-5)
    const breakdown = await connection_1.db.select({
        rating: schema_1.restaurantRatings.rating,
        count: (0, drizzle_orm_1.count)(schema_1.restaurantRatings.id),
    })
        .from(schema_1.restaurantRatings)
        .where((0, drizzle_orm_1.eq)(schema_1.restaurantRatings.restaurantId, restaurantId))
        .groupBy(schema_1.restaurantRatings.rating);
    const total = Number(stats.totalRatings) || 0;
    // بناء النسب لكل نجمة (1-5)
    const ratingBreakdown = [1, 2, 3, 4, 5].map(star => {
        const found = breakdown.find(b => b.rating === star);
        const starCount = found ? Number(found.count) : 0;
        return {
            star,
            count: starCount,
            percentage: total > 0 ? parseFloat(((starCount / total) * 100).toFixed(1)) : 0,
        };
    });
    return (0, response_1.SuccessResponse)(res, {
        data: {
            restaurant: { id: restaurant.id, name: restaurant.name },
            totalRatings: total,
            averageRating: stats.averageRating ? parseFloat(Number(stats.averageRating).toFixed(1)) : 0,
            breakdown: ratingBreakdown,
        }
    });
};
exports.getRestaurantRatingStats = getRestaurantRatingStats;
// ==========================================
// 2. Get All Ratings for a Restaurant (Admin - with user info)
// ==========================================
const getRestaurantRatings = async (req, res) => {
    const { restaurantId } = req.params;
    const ratings = await connection_1.db.select({
        id: schema_1.restaurantRatings.id,
        rating: schema_1.restaurantRatings.rating,
        comment: schema_1.restaurantRatings.comment,
        createdAt: schema_1.restaurantRatings.createdAt,
        userName: schema_1.users.name,
        userEmail: schema_1.users.email,
        userPhoto: schema_1.users.photo,
    })
        .from(schema_1.restaurantRatings)
        .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.restaurantRatings.userId, schema_1.users.id))
        .where((0, drizzle_orm_1.eq)(schema_1.restaurantRatings.restaurantId, restaurantId));
    return (0, response_1.SuccessResponse)(res, { data: ratings });
};
exports.getRestaurantRatings = getRestaurantRatings;
