import knex from "knex";
import knexConfig from "./knexfile.js";

const dbConnection = knex(knexConfig.development);

export default dbConnection;
