import { d1 } from "$lib/server/d1";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

const handles = [];

const dbHandle: Handle = async ({ event, resolve }) => {
    const DBBinding = event.platform?.env.D1_DB;
    event.locals.d1 = d1(DBBinding);

    return resolve(event);
}
handles.push(dbHandle);

export const handle = sequence(...handles);