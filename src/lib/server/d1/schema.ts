import { create } from 'domain';
import { sql } from 'drizzle-orm';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const creator = sqliteTable("creator", {
	uuid: text().primaryKey(),
	creator: text().notNull(),
	password: text().notNull(),
	createdAt: integer().notNull().default(sql`(strftime('%s', 'now'))`),
});

export const board = sqliteTable("board", {
	uuid: text().primaryKey(),
	creator: text().notNull().references(() => creator.uuid),
	name: text().notNull(),
	createdAt: integer().notNull().default(sql`(strftime('%s', 'now'))`),
});