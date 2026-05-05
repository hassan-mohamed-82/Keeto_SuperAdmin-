"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// استيراد الدوال من الكنترولر بتاع الـ Explore اللي عملناه
const home_1 = require("../../controllers/user/home");
// استيراد دوال المفضلة من الكنترولر بتاعها
const home_2 = require("../../controllers/user/home");
const catchAsync_1 = require("../../utils/catchAsync");
const router = (0, express_1.Router)();
// ==========================================
// 🏠 راوتس التصفح والشاشة الرئيسية (Explore & Home)
// ==========================================
// 1. جلب الشاشة الرئيسية (المطابخ، الفئات، المطاعم)
// 🟢 GET: /api/user/explore/
router.get("/", (0, catchAsync_1.catchAsync)(home_1.getHomeScreen));
// 2. جلب المطاعم الخاصة بمطبخ معين (مثال: المطاعم التركية)
// 🟢 GET: /api/user/explore/cuisines/:cuisineId/restaurants
router.get("/cuisines/:cuisineId/restaurants", (0, catchAsync_1.catchAsync)(home_1.getRestaurantsByCuisine));
// 3. جلب الأكلات الخاصة بفئة معينة (مثال: الشاورما)
// 🟢 GET: /api/user/explore/categories/:categoryId/items
router.get("/categories/:categoryId/items", (0, catchAsync_1.catchAsync)(home_1.getFoodsByCategory));
// 4. جلب تفاصيل مطعم معين والمنيو بتاعه
// 🟢 GET: /api/user/explore/restaurants/:restaurantId
router.get("/restaurants/:restaurantId", (0, catchAsync_1.catchAsync)(home_1.getRestaurantDetails));
// ==========================================
// 🔍 راوتس البحث (Search)
// ==========================================
// 5. البحث عن مطعم بالاسم مع جلب المنيو (اللي لسه عاملينها)
// 🟢 GET: /api/user/explore/search?query=kfc
router.get("/search", (0, catchAsync_1.catchAsync)(home_1.searchRestaurantWithMenu));
// ==========================================
// ❤️ راوتس المفضلة (Favorites)
// ==========================================
// 6. جلب قائمة المفضلة الخاصة باليوزر
// 🟢 GET: /api/user/explore/favorites
router.get("/favorites", (0, catchAsync_1.catchAsync)(home_2.getUserFavorites));
// 7. إضافة أو إزالة مطعم/أكلة من المفضلة (بتاخد في الـ Body الـ restaurantId أو foodId)
// 🟡 POST: /api/user/explore/favorites/toggle
router.post("/favorites/toggle", (0, catchAsync_1.catchAsync)(home_2.toggleFavorite));
exports.default = router;
