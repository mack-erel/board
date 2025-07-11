// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			db: DrizzleD1Database<Record<string, never>> & {
				$client: D1Database;
			};
		}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				D1_DB: D1Database;
			}
		}
	}
}

export { };
