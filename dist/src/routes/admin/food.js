"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catchAsync_1 = require("../../utils/catchAsync");
const food_1 = require("../../controllers/admin/food");
const validation_1 = require("../../middlewares/validation");
const food_2 = require("../../validation/admin/food");
const router = (0, express_1.Router)();
router.get("/select", (0, catchAsync_1.catchAsync)(food_1.getFoodSelectData));
router.get("/restaurant/:id", (0, catchAsync_1.catchAsync)(food_1.getFoodsByRestaurantId));
router.post("/", (0, validation_1.validate)(food_2.createFoodSchema), (0, catchAsync_1.catchAsync)(food_1.createFood));
router.get("/", (0, catchAsync_1.catchAsync)(food_1.getAllFoods));
router.get("/:id", (0, catchAsync_1.catchAsync)(food_1.getFoodById));
router.put("/:id", (0, validation_1.validate)(food_2.updateFoodSchema), (0, catchAsync_1.catchAsync)(food_1.updateFood));
router.delete("/:id", (0, catchAsync_1.catchAsync)(food_1.deleteFood));
// Toggle Endpoints
router.put("/variation/:id/status", (0, catchAsync_1.catchAsync)(food_1.toggleVariationStatus));
router.put("/option/:id/status", (0, catchAsync_1.catchAsync)(food_1.toggleOptionStatus));
exports.default = router;
