CREATE TABLE `pola_rencana` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pdf` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
