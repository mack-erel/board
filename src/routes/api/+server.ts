import { json } from '@sveltejs/kit';

export const GET = async ({ locals }) => {
    const d1 = locals.db;

    let status = true;

    const d1Check = d1 ? true : false;
    status = status && d1Check;

    const hyperDriveCheck = true;
    status = status && hyperDriveCheck;

    return json({
        "status": status ? "success" : "error",
        "data": {
            "D1": d1Check ? "connected" : "not connected",
            "HyperDrive": hyperDriveCheck ? "connected" : "not connected"
        }
    })
}