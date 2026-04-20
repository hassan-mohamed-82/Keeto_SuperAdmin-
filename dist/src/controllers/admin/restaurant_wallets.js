"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWalletTransactions = exports.approveWithdrawal = exports.collectCashFromRestaurant = exports.getRestaurantWallet = exports.getAllWallets = void 0;
const connection_1 = require("../../models/connection");
const schema_1 = require("../../models/schema");
const drizzle_orm_1 = require("drizzle-orm");
const uuid_1 = require("uuid");
const response_1 = require("../../utils/response");
const BadRequest_1 = require("../../Errors/BadRequest");
const NotFound_1 = require("../../Errors/NotFound");
// ==========================================
// 1. GET ALL WALLETS (Super Admin)
// ==========================================
const getAllWallets = async (req, res) => {
    const wallets = await connection_1.db
        .select({
        id: schema_1.restaurantWallets.id,
        balance: schema_1.restaurantWallets.balance,
        collectedCash: schema_1.restaurantWallets.collectedCash,
        pendingWithdraw: schema_1.restaurantWallets.pendingWithdraw,
        restaurant: {
            id: schema_1.restaurants.id,
            name: schema_1.restaurants.name,
        }
    })
        .from(schema_1.restaurantWallets)
        .leftJoin(schema_1.restaurants, (0, drizzle_orm_1.eq)(schema_1.restaurantWallets.restaurantId, schema_1.restaurants.id));
    return (0, response_1.SuccessResponse)(res, { data: wallets });
};
exports.getAllWallets = getAllWallets;
// ==========================================
// 2. GET SINGLE WALLET
// ==========================================
const getRestaurantWallet = async (req, res) => {
    const { restaurantId } = req.params;
    const wallet = await connection_1.db
        .select()
        .from(schema_1.restaurantWallets)
        .where((0, drizzle_orm_1.eq)(schema_1.restaurantWallets.restaurantId, restaurantId))
        .limit(1);
    if (!wallet[0])
        throw new NotFound_1.NotFound("Wallet not found");
    return (0, response_1.SuccessResponse)(res, { data: wallet[0] });
};
exports.getRestaurantWallet = getRestaurantWallet;
// ==========================================
// 3. COLLECT CASH (Super Admin)
// ==========================================
const collectCashFromRestaurant = async (req, res) => {
    const { restaurantId } = req.params;
    const { amount } = req.body;
    const collectAmount = Number(amount);
    if (!collectAmount || collectAmount <= 0)
        throw new BadRequest_1.BadRequest("Invalid amount");
    const wallet = await connection_1.db
        .select()
        .from(schema_1.restaurantWallets)
        .where((0, drizzle_orm_1.eq)(schema_1.restaurantWallets.restaurantId, restaurantId))
        .limit(1);
    if (!wallet[0])
        throw new NotFound_1.NotFound("Wallet not found");
    const currentCash = Number(wallet[0].collectedCash || 0);
    if (collectAmount > currentCash) {
        throw new BadRequest_1.BadRequest("Not enough collected cash");
    }
    const before = currentCash;
    const after = currentCash - collectAmount;
    await connection_1.db.transaction(async (tx) => {
        // update wallet
        await tx
            .update(schema_1.restaurantWallets)
            .set({ collectedCash: after.toString() })
            .where((0, drizzle_orm_1.eq)(schema_1.restaurantWallets.restaurantId, restaurantId));
        // log transaction
        await tx.insert(schema_1.restaurantWalletTransactions).values({
            id: (0, uuid_1.v4)(),
            restaurantId,
            type: "cash_collection",
            amount: collectAmount.toString(),
            balanceBefore: before.toString(),
            balanceAfter: after.toString(),
            method: "cash",
            note: "Super admin collected cash",
        });
    });
    return (0, response_1.SuccessResponse)(res, { message: "Cash collected successfully" });
};
exports.collectCashFromRestaurant = collectCashFromRestaurant;
// ==========================================
// 4. APPROVE WITHDRAWAL
// ==========================================
const approveWithdrawal = async (req, res) => {
    const { restaurantId } = req.params;
    const { amount } = req.body;
    const approveAmount = Number(amount);
    if (!approveAmount || approveAmount <= 0)
        throw new BadRequest_1.BadRequest("Invalid amount");
    const wallet = await connection_1.db
        .select()
        .from(schema_1.restaurantWallets)
        .where((0, drizzle_orm_1.eq)(schema_1.restaurantWallets.restaurantId, restaurantId))
        .limit(1);
    if (!wallet[0])
        throw new NotFound_1.NotFound("Wallet not found");
    const pending = Number(wallet[0].pendingWithdraw || 0);
    const withdrawn = Number(wallet[0].totalWithdrawn || 0);
    if (approveAmount > pending) {
        throw new BadRequest_1.BadRequest("Amount exceeds pending withdraw");
    }
    await connection_1.db.transaction(async (tx) => {
        await tx.update(schema_1.restaurantWallets)
            .set({
            pendingWithdraw: (pending - approveAmount).toString(),
            totalWithdrawn: (withdrawn + approveAmount).toString()
        })
            .where((0, drizzle_orm_1.eq)(schema_1.restaurantWallets.restaurantId, restaurantId));
        await tx.insert(schema_1.restaurantWalletTransactions).values({
            id: (0, uuid_1.v4)(),
            restaurantId,
            type: "withdraw_approved",
            amount: approveAmount.toString(),
            balanceBefore: pending.toString(),
            balanceAfter: (pending - approveAmount).toString(),
            method: "bank",
            note: "Withdrawal approved by admin",
        });
    });
    return (0, response_1.SuccessResponse)(res, { message: "Withdrawal approved" });
};
exports.approveWithdrawal = approveWithdrawal;
// ==========================================
// 5. WALLET TRANSACTIONS HISTORY
// ==========================================
const getWalletTransactions = async (req, res) => {
    const { restaurantId } = req.params;
    const data = await connection_1.db
        .select()
        .from(schema_1.restaurantWalletTransactions)
        .where((0, drizzle_orm_1.eq)(schema_1.restaurantWalletTransactions.restaurantId, restaurantId));
    return (0, response_1.SuccessResponse)(res, { data });
};
exports.getWalletTransactions = getWalletTransactions;
