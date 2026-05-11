"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rating_1 = require("../../controllers/admin/rating");
const catchAsync_1 = require("../../utils/catchAsync");
const router = (0, express_1.Router)();
router.get("/:restaurantId/stats", (0, catchAsync_1.catchAsync)(rating_1.getRestaurantRatingStats));
router.get("/:restaurantId", (0, catchAsync_1.catchAsync)(rating_1.getRestaurantRatings));
exports.default = router;
