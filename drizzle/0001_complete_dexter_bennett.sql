CREATE TABLE `article` (
	`uuid` text PRIMARY KEY NOT NULL,
	`board` text NOT NULL,
	`subject` text NOT NULL,
	`content` text NOT NULL,
	`additional` text DEFAULT '{}' NOT NULL,
	`createdAt` real DEFAULT (round((strftime('%s') - strftime('%S') + strftime('%f')) * 10000)) NOT NULL,
	FOREIGN KEY (`board`) REFERENCES `board`(`uuid`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_board` (
	`uuid` text PRIMARY KEY NOT NULL,
	`creator` text NOT NULL,
	`name` text NOT NULL,
	`createdAt` real DEFAULT (round((strftime('%s') - strftime('%S') + strftime('%f')) * 10000)) NOT NULL,
	FOREIGN KEY (`creator`) REFERENCES `creator`(`uuid`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_board`("uuid", "creator", "name", "createdAt") SELECT "uuid", "creator", "name", "createdAt" FROM `board`;--> statement-breakpoint
DROP TABLE `board`;--> statement-breakpoint
ALTER TABLE `__new_board` RENAME TO `board`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_creator` (
	`uuid` text PRIMARY KEY NOT NULL,
	`creator` text NOT NULL,
	`password` text NOT NULL,
	`createdAt` real DEFAULT (round((strftime('%s') - strftime('%S') + strftime('%f')) * 10000)) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_creator`("uuid", "creator", "password", "createdAt") SELECT "uuid", "creator", "password", "createdAt" FROM `creator`;--> statement-breakpoint
DROP TABLE `creator`;--> statement-breakpoint
ALTER TABLE `__new_creator` RENAME TO `creator`;