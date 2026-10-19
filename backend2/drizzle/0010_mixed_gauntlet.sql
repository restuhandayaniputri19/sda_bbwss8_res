CREATE TABLE `berita_galleries` (
	`berita_id` integer NOT NULL,
	`gallery_id` integer NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	PRIMARY KEY(`berita_id`, `gallery_id`),
	FOREIGN KEY (`berita_id`) REFERENCES `berita`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`gallery_id`) REFERENCES `galleries`(`id`) ON UPDATE no action ON DELETE cascade
);
