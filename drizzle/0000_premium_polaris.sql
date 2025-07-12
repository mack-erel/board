CREATE TABLE `board` (
	`uuid` text PRIMARY KEY NOT NULL,
	`creator` text NOT NULL,
	`name` text NOT NULL,
	`createdAt` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`creator`) REFERENCES `creator`(`uuid`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `creator` (
	`uuid` text PRIMARY KEY NOT NULL,
	`creator` text NOT NULL,
	`password` text NOT NULL,
	`createdAt` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
