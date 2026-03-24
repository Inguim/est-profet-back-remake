import knex from "knex";
import config from "./src/database/knexfile.js";

export default async () => {
	const db = knex(config.test);

	await db.migrate.rollback(undefined, true);
	await db.migrate.latest();
	await db.seed.run();

	await db.destroy();
};
