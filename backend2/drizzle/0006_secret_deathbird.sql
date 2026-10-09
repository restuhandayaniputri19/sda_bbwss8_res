CREATE TABLE `majalah` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`thumbnail` text NOT NULL,
	`title` text NOT NULL,
	`url` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
