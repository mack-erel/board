import { creator } from "$lib/server/d1/schema.js";
import { json, text } from "@sveltejs/kit";
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

    let userInfo = {};

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
    }

    console.log(userInfo);
    // const { locals, request } = event;
    // const d1 = locals.d1;

    // const body = await request.json();

    // const undefined_params = [];

    // if (typeof body.creator === "undefined") {
    //     undefined_params.push({ "creator": "string" });
    // }
    // if (typeof body.name === "undefined") {
    //     undefined_params.push({ "name": "string" });
    // }

    // if (undefined_params.length > 0) {
    //     return json({
    //         status: "error",
    //         message: "Missing parameters",
    //         data: [...undefined_params]
    //     });
    // }

    // const { creator, name } = body;
    // const uuid = crypto.randomUUID();



    return json({});
}