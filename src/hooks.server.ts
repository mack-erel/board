import { d1 } from "$lib/server/d1";
import { user } from "$lib/server/d1/schema";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { sql } from "drizzle-orm";

const handles = [];

const dbHandle: Handle = async ({ event, resolve }) => {
    const DBBinding = event.platform?.env.D1_DB;
    event.locals.db = d1(DBBinding);

    return resolve(event);
}
handles.push(dbHandle);

export const handle = sequence(...handles);