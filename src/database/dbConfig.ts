import knex from "knex";
import knexConfig from "./knexfile.js";
import { getEnv } from "../utils/helpers/getEnv.js";

const NODE_ENV = getEnv("NODE_ENV") || "development";

const dbConnection = knex(knexConfig[NODE_ENV as keyof typeof knexConfig]);

dbConnection.on("query", (query) => {
	console.log("SQL:", query.sql);
	console.log("Bindings:", query.bindings);
});

export default dbConnection;
