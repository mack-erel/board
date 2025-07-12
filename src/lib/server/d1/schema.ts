import { create } from 'domain';
import { sql } from 'drizzle-orm';
import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const creator = sqliteTable("creator", {
	uuid: text().primaryKey(),
	creator: text().notNull(),
	password: text().notNull(),
	createdAt: real().notNull().default(sql`(round((strftime('%s') - strftime('%S') + strftime('%f')) * 10000))`),
});

export const board = sqliteTable("board", {
	uuid: text().primaryKey(),
	creator: text().notNull().references(() => creator.uuid),
	name: text().notNull(),
	createdAt: real().notNull().default(sql`(round((strftime('%s') - strftime('%S') + strftime('%f')) * 10000))`),
});

export const article = sqliteTable("article", {
	uuid: text().primaryKey(),
	board: text().notNull().references(() => board.uuid),
	subject: text().notNull(),
	content: text().notNull(),
	additional: text().notNull().default("{}"),
	createdAt: real().notNull().default(sql`(round((strftime('%s') - strftime('%S') + strftime('%f')) * 10000))`),
});