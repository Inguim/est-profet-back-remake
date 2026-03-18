import { Router } from "express";
import { ContribuidorController } from "../controllers/index.js";
import { ContribuidorService } from "../services/ContribuidorService.js";
import { GitHubProvider } from "../providers/GitHubProvider.js";
import { ensureAuthMiddleware } from "../middlewares/EnsureAuthMiddleware.js";
import { ensureAdminMiddleware } from "../middlewares/EnsureAdminMiddleware.js";
import { ValidateContribuidorMiddleware } from "../middlewares/ValidateContribuidorMiddleware.js";

const gitHubProvider = new GitHubProvider();
const contribuidorService = new ContribuidorService({ gitHubProvider });

const contribuidorController = new ContribuidorController({ contribuidorService });

const { create: createMiddleware, update: updateMiddleware } = ValidateContribuidorMiddleware;

const router = Router();

router.post("/", ensureAuthMiddleware, ensureAdminMiddleware, createMiddleware, (req, res, next) =>
	contribuidorController.create(req, res, next),
);
router.get("/", (req, res, next) => contribuidorController.list(req as any, res, next));

router.put("/:id", ensureAuthMiddleware, ensureAdminMiddleware, updateMiddleware, (req, res, next) =>
	contribuidorController.update(req, res, next),
);
router.get("/:id", ensureAuthMiddleware, ensureAdminMiddleware, (req, res, next) =>
	contribuidorController.get(req as any, res, next),
);

export { router };
