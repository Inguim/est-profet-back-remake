import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import path from "path";
import dbPgConfig from "../utils/constants/envDB.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('knex').Knex.Config} */

const communConfig = {
	client: "postgresql",
	migrations: {
		directory: path.join(__dirname, "migrations"),
	},
	seeds: {
		directory: path.join(__dirname, "seeds"),
	},
	useNullAsDefault: true,
};

const knexConfig = {
	development: {
		...communConfig,
		client: "postgresql",
		connection: dbPgConfig,
	},
	test: {
		...communConfig,
		client: "postgresql",
		connection: dbPgConfig,
	},
};

export default knexConfig;
