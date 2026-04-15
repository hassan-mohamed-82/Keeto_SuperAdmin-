ALTER TABLE `food` RENAME COLUMN `allegren_ingredients` TO `allergen_ingredients`;--> statement-breakpoint
ALTER TABLE `food` RENAME COLUMN `search_tages` TO `search_tags`;--> statement-breakpoint
ALTER TABLE `restaurants` MODIFY COLUMN `status` enum('active','inactive') DEFAULT 'active';--> statement-breakpoint
ALTER TABLE `food` MODIFY COLUMN `price` decimal(10,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `food` MODIFY COLUMN `discount_value` decimal(10,2);--> statement-breakpoint
ALTER TABLE `food` MODIFY COLUMN `Maximum_Purchase` int;--> statement-breakpoint
ALTER TABLE `restaurants` ADD `type` enum('restaurantadmin','superadmin') DEFAULT 'restaurantadmin';