import "dotenv/config";
import express from "express";
import { routes } from "./routes/index.js";
import { errorHandlingMiddleware } from "./middlewares/index.js";
interface AppConfig {
	port: number;
}

const config: AppConfig = {
	port: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 3000,
};

const app = express();

routes(app);

app.use(errorHandlingMiddleware);

app.get("/", (req, res) => {
	res.send("Hello, World!");
});

app.listen(config.port, () => {
	console.log(`Server is running on port ${config.port}`);
});
