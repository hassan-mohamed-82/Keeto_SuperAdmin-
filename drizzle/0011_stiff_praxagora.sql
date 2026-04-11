ALTER TABLE `restaurant_schedules` MODIFY COLUMN `restaurant_id` char(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `restaurant_settings` MODIFY COLUMN `restaurant_id` char(36) NOT NULL;