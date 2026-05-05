import { Request, Response } from "express";
import { db } from "../../models/connection";
import { cuisines, categories, restaurants, food, favorites, foodVariations, variationOptions } from "../../models/schema";
import { eq, and, like, or } from "drizzle-orm";
import { SuccessResponse } from "../../utils/response";
import { BadRequest, UnauthorizedError } from "../../Errors";

// ==========================================
// 🔥 Helper: تجهيز favorites لو اليوزر عامل login
// ==========================================
const getUserFavoritesSets = async (userId?: string) => {
    const favoriteRestaurantIds = new Set<string>();
    const favoriteFoodIds = new Set<string>();

    if (!userId) return { favoriteRestaurantIds, favoriteFoodIds };

    const userFavorites = await db
        .select()
        .from(favorites)
        .where(eq(favorites.userId, userId));

    userFavorites.forEach(f => {
        if (f.restaurantId) favoriteRestaurantIds.add(f.restaurantId);
        if (f.foodId) favoriteFoodIds.add(f.foodId);
    });

    return { favoriteRestaurantIds, favoriteFoodIds };
};

// ==========================================
// 1. Home Screen
// ==========================================
export const getHomeScreen = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { favoriteRestaurantIds } = await getUserFavoritesSets(userId);

    const activeCuisines = await db.select({
        id: cuisines.id,
        name: cuisines.name,
        image: cuisines.Image
    }).from(cuisines).where(eq(cuisines.status, "active"));

    const activeCategories = await db.select({
        id: categories.id,
        name: categories.name,
        image: categories.Image
    }).from(categories).where(eq(categories.status, "active"));

    const restaurantsData = await db.select({
        id: restaurants.id,
        name: restaurants.name,
        cover: restaurants.cover,
        logo: restaurants.logo,
        address: restaurants.address,
        minDeliveryTime: restaurants.minDeliveryTime,
    }).from(restaurants).where(eq(restaurants.status, "active"));

    const popularRestaurants = restaurantsData.map(r => ({
        ...r,
        isFavorite: userId ? favoriteRestaurantIds.has(r.id) : false
    }));

    return SuccessResponse(res, {
        data: {
            cuisines: activeCuisines,
            categories: activeCategories,
            restaurants: popularRestaurants
        }
    });
};

// ==========================================
// 2. Restaurants by Cuisine
// ==========================================
export const getRestaurantsByCuisine = async (req: Request, res: Response) => {
    const { cuisineId } = req.params;
    const userId = req.user?.id;

    const { favoriteRestaurantIds } = await getUserFavoritesSets(userId);

    const data = await db.select({
        id: restaurants.id,
        name: restaurants.name,
        cover: restaurants.cover,
        logo: restaurants.logo,
        address: restaurants.address,
        minDeliveryTime: restaurants.minDeliveryTime,
    }).from(restaurants)
    .where(and(
        eq(restaurants.cuisineId, cuisineId),
        eq(restaurants.status, "active")
    ));

    const result = data.map(r => ({
        ...r,
        isFavorite: userId ? favoriteRestaurantIds.has(r.id) : false
    }));

    return SuccessResponse(res, { data: result });
};

// ==========================================
// 3. Foods by Category
// ==========================================
export const getFoodsByCategory = async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const userId = req.user?.id;

    const { favoriteFoodIds } = await getUserFavoritesSets(userId);

    const data = await db.select({
        foodId: food.id,
        foodName: food.name,
        foodImage: food.image,
        price: food.price,
        restaurantId: restaurants.id,
        restaurantName: restaurants.name,
        restaurantLogo: restaurants.logo
    })
    .from(food)
    .leftJoin(restaurants, eq(food.restaurantid, restaurants.id))
    .where(and(
        eq(food.categoryid, categoryId),
        eq(food.status, "active")
    ));

    const result = data.map(f => ({
        ...f,
        isFavorite: userId ? favoriteFoodIds.has(f.foodId) : false
    }));

    return SuccessResponse(res, { data: result });
};

// ==========================================
// 4. Restaurant Details + Menu
// ==========================================
export const getRestaurantDetails = async (req: Request, res: Response) => {
    const { restaurantId } = req.params;
    const userId = req.user?.id;

    const { favoriteFoodIds, favoriteRestaurantIds } = await getUserFavoritesSets(userId);

    const [restaurantInfo] = await db.select().from(restaurants)
        .where(eq(restaurants.id, restaurantId));

    if (!restaurantInfo) throw new Error("Restaurant not found");

    const restaurantWithFav = {
        ...restaurantInfo,
        isFavorite: userId ? favoriteRestaurantIds.has(restaurantId) : false
    };

    const rawMenu = await db.select({
        foodId: food.id,
        foodName: food.name,
        description: food.description,
        price: food.price,
        image: food.image,
        categoryName: categories.name,
        variationId: foodVariations.id,
        variationName: foodVariations.name,
        isRequired: foodVariations.isRequired,
        selectionType: foodVariations.selectionType,
        min: foodVariations.min,
        max: foodVariations.max,
        optionId: variationOptions.id,
        optionName: variationOptions.optionName,
        additionalPrice: variationOptions.additionalPrice
    })
    .from(food)
    .leftJoin(categories, eq(food.categoryid, categories.id))
    .leftJoin(foodVariations, eq(food.id, foodVariations.foodId))
    .leftJoin(variationOptions, eq(foodVariations.id, variationOptions.variationId))
    .where(and(
        eq(food.restaurantid, restaurantId),
        eq(food.status, "active")
    ));

    const groupedMenuObj = rawMenu.reduce((acc: any, row) => {
        const catName = row.categoryName || "Other";

        if (!acc[catName]) acc[catName] = {};

        if (!acc[catName][row.foodId]) {
            acc[catName][row.foodId] = {
                id: row.foodId,
                name: row.foodName,
                description: row.description,
                price: row.price,
                image: row.image,
                isFavorite: userId ? favoriteFoodIds.has(row.foodId) : false,
                variations: {}
            };
        }

        if (row.variationId) {
            if (!acc[catName][row.foodId].variations[row.variationId]) {
                acc[catName][row.foodId].variations[row.variationId] = {
                    id: row.variationId,
                    name: row.variationName,
                    isRequired: row.isRequired,
                    selectionType: row.selectionType,
                    min: row.min,
                    max: row.max,
                    options: []
                };
            }

            if (row.optionId) {
                acc[catName][row.foodId].variations[row.variationId].options.push({
                    id: row.optionId,
                    name: row.optionName,
                    additionalPrice: row.additionalPrice
                });
            }
        }

        return acc;
    }, {});

    const finalMenu: any = {};
    for (const [category, foodsObj] of Object.entries(groupedMenuObj)) {
        finalMenu[category] = Object.values(foodsObj as object).map((f: any) => {
            f.variations = Object.values(f.variations);
            return f;
        });
    }

    return SuccessResponse(res, {
        data: {
            restaurant: restaurantWithFav,
            menu: finalMenu
        }
    });
};

// ==========================================
// 5. Toggle Favorite
// ==========================================
export const toggleFavorite = async (req: Request, res: Response) => {
    if (!req.user) throw new UnauthorizedError("Unauthenticated");

    const userId = req.user.id;
    const { restaurantId, foodId } = req.body;

    if (!restaurantId && !foodId)
        throw new BadRequest("Restaurant ID or Food ID is required");

    if (restaurantId && foodId)
        throw new BadRequest("Send only one");

    const condition = restaurantId
        ? and(eq(favorites.userId, userId), eq(favorites.restaurantId, restaurantId))
        : and(eq(favorites.userId, userId), eq(favorites.foodId, foodId));

    const [existingFav] = await db.select().from(favorites).where(condition);

    if (existingFav) {
        await db.delete(favorites).where(eq(favorites.id, existingFav.id));
        return SuccessResponse(res, { isFavorite: false });
    }

    await db.insert(favorites).values({
        userId,
        restaurantId: restaurantId || null,
        foodId: foodId || null
    });

    return SuccessResponse(res, { isFavorite: true });
};

// ==========================================
// 6. جلب قائمة المفضلة ليوزر معين (Wishlist)
// ==========================================
export const getUserFavorites = async (req: Request, res: Response) => {
    // 1. التحقق من تسجيل الدخول
    if (!req.user) throw new UnauthorizedError("Unauthenticated");
    const userId = req.user.id;

    // 2. جلب البيانات مع عمل Join لجدول المطاعم وجدول الأكلات
    // ملاحظة: تأكد من استيراد جداول (restaurants) و (foods) في ملفك
    const favs = await db.select({
        favoriteId: favorites.id,
        // بيانات المطعم (ستكون null لو كان السجل يخص أكلة)
        restaurant: {
            id: restaurants.id,
            name: restaurants.name,
            cover: restaurants.cover,
            logo: restaurants.logo,
            address: restaurants.address,
            
        },
        // بيانات الأكلة (ستكون null لو كان السجل يخص مطعم)
        food: {
            id: food.id,
            name: food.name,
            price: food.price,
            image: food.image,
        }
    })
    .from(favorites)
    .leftJoin(restaurants, eq(favorites.restaurantId, restaurants.id))
    .leftJoin(food, eq(favorites.foodId, food.id))
    .where(eq(favorites.userId, userId));

    // 3. تنسيق البيانات (اختياري): لفصل المطاعم عن الأكلات في الـ Response
    const result = {
        restaurants: favs.filter(f => f.restaurant?.id !== null).map(f => f.restaurant),
        foods: favs.filter(f => f.food?.id !== null).map(f => f.food)
    };

    return SuccessResponse(res, { data: result });
};



export const searchRestaurantWithMenu = async (req: Request, res: Response) => {
    const { query } = req.query;

    if (!query || typeof query !== "string") {
        throw new BadRequest("من فضلك أدخل كلمة البحث");
    }

    const searchTerm = `%${query}%`;

    // 1. هنجيب الداتا كلها مسطحة باستخدام الـ Joins
    const flatResults = await db
        .select({
            restaurant: restaurants,
            food: food,
            variation: foodVariations,
            option: variationOptions
        })
        .from(restaurants)
        .leftJoin(food, eq(restaurants.id, food.restaurantid))
        .leftJoin(foodVariations, eq(food.id, foodVariations.foodId))
        .leftJoin(variationOptions, eq(foodVariations.id, variationOptions.variationId))
        .where(
            or(
                like(restaurants.name, searchTerm),
                like(restaurants.nameAr, searchTerm),
                like(restaurants.nameFr, searchTerm)
            )
        );

    // 2. تجميع الداتا (Grouping) عشان نرجعها متداخلة ومرتبة
    const restaurantsMap = new Map();

    for (const row of flatResults) {
        const r = row.restaurant;
        const f = row.food;
        const v = row.variation;
        const o = row.option;

        // لو المطعم مش موجود في الماب، ضيفه وضيف جواه ماب للأكل
        if (!restaurantsMap.has(r.id)) {
            restaurantsMap.set(r.id, { ...r, food: new Map() });
        }
        const currentRestaurant = restaurantsMap.get(r.id);

        // لو فيه أكل تبع المطعم ده
        if (f) {
            if (!currentRestaurant.food.has(f.id)) {
                currentRestaurant.food.set(f.id, { ...f, variations: new Map() });
            }
            const currentFood = currentRestaurant.food.get(f.id);

            // لو فيه فارييشن تبع الأكلة دي
            if (v) {
                if (!currentFood.variations.has(v.id)) {
                    currentFood.variations.set(v.id, { ...v, options: [] });
                }
                const currentVariation = currentFood.variations.get(v.id);

                // لو فيه أوبشن تبع الفارييشن ده
                if (o) {
                    currentVariation.options.push(o);
                }
            }
        }
    }

    // 3. تحويل الماب لـ Array عشان يرجع كـ JSON سليم للفرونت إند
    const formattedData = Array.from(restaurantsMap.values()).map(r => ({
        ...r,
        food: Array.from(r.food.values()).map((f: any) => ({
            ...f,
            variations: Array.from(f.variations.values()) // الفارييشنز وجواها الـ options كـ array
        }))
    }));

    return SuccessResponse(res, { 
        message: "Fetched restaurant and menu data successfully", 
        data: formattedData 
    });
};

