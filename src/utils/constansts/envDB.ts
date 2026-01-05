import { getEnv } from "../helpers/getEnv.js";

type TDBPgCongig = {
	host: string;
	port: number;
	user: string;
	password: string;
	database: string;
};

const dbPgConfig: TDBPgCongig = {
	host: getEnv("PG_HOST") || "localhost",
	port: parseInt(getEnv("PG_PORT"), 10) || 5432,
	user: getEnv("PG_USER"),
	password: getEnv("PG_PASSWORD"),
	database: getEnv("PG_DATABASE"),
};

export default dbPgConfig;
