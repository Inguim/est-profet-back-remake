import "dotenv/config";
import express from "express";
import { routes } from "./routes/index.js";
import { errorHandlingMiddleware } from "./middlewares/index.js";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { fileURLToPath } from "url";
import SwaggerParser from "@apidevtools/swagger-parser";
import { getEnv } from "./utils/helpers/getEnv.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openApiPath = path.resolve(__dirname, "../docs/openapi.yaml");

const app = express();

const APP_PORT = getEnv("APP_PORT");

routes(app);

app.use(errorHandlingMiddleware);

(async () => {
	const api = await SwaggerParser.bundle(openApiPath);

	app.use("/docs", swaggerUi.serve, swaggerUi.setup(api));
})();

app.get("/", (req, res) => {
	res.send("Hello, World!");
});

app.listen(APP_PORT, () => {
	console.log(`Server is running on port ${APP_PORT}`);
});
