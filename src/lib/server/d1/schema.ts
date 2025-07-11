import { create } from 'domain';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const creator = sqliteTable("creator", {
	uuid: text().primaryKey(),
	creator: text().notNull(),
	password: text().notNull(),
	createdAt: integer().notNull().default(Date.now()),
});

export const board = sqliteTable("board", {
	uuid: text().primaryKey(),
	creator: text().notNull().references(() => creator.uuid),
	name: text().notNull(),
	createdAt: integer().notNull().default(Date.now()),
});