import { board, creator } from "$lib/server/d1/schema.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";

export const POST = async (event) => {
    const { locals, request, request: { headers } } = event;
    const d1 = locals.d1;

    const authorization = headers.get("authorization");
    if (!authorization) {
        return json({
            status: "error",
            message: "Authorization header is missing"
        }, { status: 401 });
    }

    let userInfo: { uuid?: string; creator?: string; password?: string; createdAt?: number } = {};

    if (authorization.startsWith("Basic ")) {
        const base64Credentials = authorization.split(" ")[1];
        const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
        const [username, password] = credentials.split(":");

        if (!username || !password) {
            return json({
                status: "error",
                message: "Invalid authorization format"
            }, { status: 400 });
        }

        const login = await d1.select()
            .from(creator)
            .where(eq(creator.creator, username));

        if (login.length === 0) {
            return json({
                status: "error",
                message: "Invalid credentials"
            }, { status: 401 });
        }

        if (login[0].password !== crypto.createHash("sha256").update(password).digest("hex")) {
            return json({
                status: "error",
                message: "Invalid credentials"
            }, { status: 401 });
        }

        userInfo = login[0];
    } else {
        return json({
            status: "error",
            message: "Invalid authorization format"
        }, { status: 401 });
    }

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

    if (typeof body.name === "undefined" || body.name.trim() === "") {
        undefined_params.name = "string";
    }

    if (Object.keys(undefined_params).length > 0) {
        return json({
            status: "error",
            message: "Missing parameters",
            data: undefined_params
        }, { status: 400 });
    }

    if (!userInfo.uuid) {
        return json({
            status: "error",
            message: "Invalid credentials"
        }, { status: 401 });
    }

    const checkExists = await d1.select()
        .from(board)
        .where(
            eq(board.creator, userInfo.uuid),
            eq(board.name, body.name)
        );

    if (checkExists.length > 0) {
        return json({
            status: "error",
            message: "Board already exists",
        }, { status: 409 });
    }

    const newBoard = {
        uuid: crypto.randomUUID(),
        creator: userInfo.uuid,
        name: body.name
    };

    try {
        await d1.insert(board).values(newBoard);

        return json({
            status: "success",
            data: {
                uuid: newBoard.uuid,
                name: newBoard.name
            }
        });
    } catch (error: any) {
        return json({
            status: "error",
            message: "Database error",
            data: error.message
        });
    }
}