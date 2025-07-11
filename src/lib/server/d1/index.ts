import { drizzle } from "drizzle-orm/d1";
import type { D1Database } from "@cloudflare/workers-types";

export const d1 = (db: D1Database | undefined) => {
    if (!db) {
        throw new Error("D1Database is not defined. Please ensure that the D1 database is properly initialized.");
    }
    return drizzle(db);
}