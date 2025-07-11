import { defineConfig } from "drizzle-kit";

if (!process.env.CLOUDFLARE_ACCOUNT_ID) throw new Error("CLOUDFLARE_ACCOUNT_ID is not set");
if (!process.env.CLOUDFLARE_DATABASE_ID) throw new Error("CLOUDFLARE_DATABASE_ID is not set");
if (!process.env.CLOUDFLARE_API_TOKEN) throw new Error("CLOUDFLARE_API_TOKEN is not set");

export default defineConfig({
	schema: "./src/lib/server/d1/schema.ts",
	dialect: "sqlite",
	// driver: "d1-http",
	dbCredentials: {
		url: ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/661150fc81d3a9b0e4d6657a948f24da9931e3d0eeb44389b380558c5607025c.sqlite"
		// accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
		// databaseId: process.env.CLOUDFLARE_DATABASE_ID,
		// token: process.env.CLOUDFLARE_API_TOKEN
	}
});
