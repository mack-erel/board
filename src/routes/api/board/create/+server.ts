import { json, text } from '@sveltejs/kit';

export const POST = async (event) => {
    const { locals, request } = event;
    const d1 = locals.d1;

    const body = await request.json();

    const undefined_params = [];

    if (typeof body.creator === "undefined") {
        undefined_params.push({ "creator": "string" });
    }
    if (typeof body.name === "undefined") {
        undefined_params.push({ "name": "string" });
    }

    if (undefined_params.length > 0) {
        return json({
            status: "error",
            message: "Missing parameters",
            data: [...undefined_params]
        });
    }

    const { creator, name } = body;
    const uuid = crypto.randomUUID();

    

    return json({});
}