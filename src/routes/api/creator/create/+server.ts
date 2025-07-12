import { creator } from "$lib/server/d1/schema.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";

export const POST = async (event) => {
    const { request, locals: { d1 } } = event;

    let body: Record<string, string> = {};
    if (request.headers.get("content-type")?.includes("application/json")) {
        body = await request.json();
    } else if (request.headers.get("content-type")?.includes("multipart/form-data")) {
        const formData = await request.formData();
        body = Object.fromEntries(formData) as Record<string, string>;
    } else if (request.headers.get("content-type")?.includes("application/x-www-form-urlencoded")) {
        const formData = await request.formData();
        body = Object.fromEntries(formData) as Record<string, string>;
    } else {
        return json({
            status: "error",
            message: "Invalid content type",
        }, { status: 400 });
    }

    const undefined_params = {} as Record<string, string>;

    if (typeof body.creator === "undefined" || body.creator.trim() === "") {
        undefined_params.creator = "string";
    }
    if (typeof body.password === "undefined" || body.password.trim() === "") {
        undefined_params.password = "string";
    }

    if (Object.keys(undefined_params).length > 0) {
        return json({
            status: "error",
            message: "Missing parameters",
            data: undefined_params
        }, { status: 400 });
    }

    const checkExists = await d1.select()
        .from(creator)
        .where(eq(creator.creator, body.creator));

    if (checkExists.length > 0) {
        return json({
            status: "error",
            message: "Creator already exists",
        }, { status: 409 });
    }

    const newCreator = {
        uuid: crypto.randomUUID(),
        creator: body.creator,
        password: crypto.createHash("sha256").update(body.password).digest("hex")
    };

    try {
        await d1.insert(creator).values(newCreator);

        return json({
            status: "success"
        });
    } catch (error: any) {
        return json({
            status: "error",
            message: "Database error",
            data: error.message
        });
    }
}