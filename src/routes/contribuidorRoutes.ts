import { Router } from "express";
import { ContribuidorController } from "../controllers/index.js";
import { ContribuidorService } from "../services/ContribuidorService.js";
import { GitHubProvider } from "../providers/GitHubProvider.js";
import { ensureAuthMiddleware } from "../middlewares/EnsureAuthMiddleware.js";
import { ensureAdminMiddleware } from "../middlewares/EnsureAdminMiddleware.js";

const gitHubProvider = new GitHubProvider();
const contribuidorService = new ContribuidorService({ gitHubProvider });

const contribuidorController = new ContribuidorController({ contribuidorService });

const router = Router();

router.post("/", ensureAuthMiddleware, ensureAdminMiddleware, (req, res, next) =>
	contribuidorController.create(req, res, next),
);

export { router };
