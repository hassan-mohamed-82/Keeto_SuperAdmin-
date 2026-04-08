CREATE TABLE `cuisines` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`name` varchar(255) NOT NULL,
	`image` varchar(255) NOT NULL,
	`meta_image` varchar(255),
	`description` text,
	`meta_description` text,
	`status` enum('active','inactive') DEFAULT 'active',
	`total_restaurants` varchar(255) DEFAULT '0',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cuisines_id` PRIMARY KEY(`id`)
);
