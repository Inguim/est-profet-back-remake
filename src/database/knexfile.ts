import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import path from "path";
import dbPgConfig from "../utils/constansts/envDB.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('knex').Knex.Config} */

const knexConfig = {
	development: {
		client: "postgresql",
		connection: dbPgConfig,
		migrations: {
			directory: path.join(__dirname, "migrations"),
		},
		seeds: {
			directory: path.join(__dirname, "seeds"),
		},
		useNullAsDefault: true,
	},
};

export default knexConfig;
