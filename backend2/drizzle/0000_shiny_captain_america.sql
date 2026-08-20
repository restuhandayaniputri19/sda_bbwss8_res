CREATE TABLE `public_auth` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ul_id` text NOT NULL,
	`identifier` text NOT NULL,
	`type` text DEFAULT 'whatsapp' NOT NULL,
	`otp_code` text NOT NULL,
	`expires_at` integer NOT NULL,
	`last_request` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `public_auth_ul_id_unique` ON `public_auth` (`ul_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `unq_idx` ON `public_auth` (`identifier`,`type`);--> statement-breakpoint
CREATE UNIQUE INDEX `external_idx` ON `public_auth` (`ul_id`);--> statement-breakpoint
CREATE TABLE `admin_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`username` text,
	`action` text NOT NULL,
	`target_entity` text,
	`target_id` text,
	`details` text DEFAULT '{}',
	`ip_address` text,
	`created_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `galleries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`url` text NOT NULL,
	`description` text,
	`category` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `infografis` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`url` text NOT NULL,
	`description` text,
	`category` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `kesiapsiagaan_bencana` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`url` text NOT NULL,
	`description` text,
	`release_date` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `pengaduan_masyarakat` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nama_pelapor` text NOT NULL,
	`no_wa` text NOT NULL,
	`email` text,
	`kategori` text NOT NULL,
	`lokasi` text NOT NULL,
	`deskripsi` text NOT NULL,
	`file_lampiran` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`status_logs` text DEFAULT '[]',
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
CREATE TABLE `permintaan_data` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nama_lengkap` text NOT NULL,
	`instansi` text,
	`jenis_data` text NOT NULL,
	`periode_dari` text NOT NULL,
	`periode_sampai` text NOT NULL,
	`email` text NOT NULL,
	`no_wa` text NOT NULL,
	`tujuan_penggunaan` text NOT NULL,
	`file_surat` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`status_logs` text DEFAULT '[]',
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`last_login` integer,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);