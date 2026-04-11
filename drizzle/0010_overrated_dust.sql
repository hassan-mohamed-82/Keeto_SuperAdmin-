CREATE TABLE `restaurant_schedules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`restaurant_id` int NOT NULL,
	`day_of_week` int NOT NULL,
	`is_off_day` boolean DEFAULT false,
	`opening_time` varchar(5),
	`closing_time` varchar(5),
	CONSTRAINT `restaurant_schedules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `restaurant_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`restaurant_id` int NOT NULL,
	`food_management` boolean DEFAULT true,
	`scheduled_delivery` boolean DEFAULT false,
	`reviews_section` boolean DEFAULT true,
	`pos_section` boolean DEFAULT false,
	`self_delivery` boolean DEFAULT false,
	`home_delivery` boolean DEFAULT true,
	`takeaway` boolean DEFAULT false,
	`order_subscription` boolean DEFAULT false,
	`instant_order` boolean DEFAULT false,
	`halal_tag_status` boolean DEFAULT false,
	`dine_in` boolean DEFAULT false,
	`veg_type` enum('VEG','NON_VEG','BOTH') DEFAULT 'BOTH',
	`can_edit_order` boolean DEFAULT false,
	`min_order_amount` decimal(10,2) DEFAULT '0.00',
	`min_delivery_time` int DEFAULT 15,
	`max_delivery_time` int DEFAULT 25,
	`is_always_open` boolean DEFAULT false,
	`is_same_time_every_day` boolean DEFAULT false,
	CONSTRAINT `restaurant_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `restaurant_settings_restaurant_id_unique` UNIQUE(`restaurant_id`)
);
