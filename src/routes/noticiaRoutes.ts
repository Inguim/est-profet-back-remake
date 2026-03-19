import { Router } from "express";
import { ensureAuthMiddleware } from "../middlewares/EnsureAuthMiddleware.js";
import { ensureAdminMiddleware } from "../middlewares/EnsureAdminMiddleware.js";
import { ValidateNoticiaMiddleware } from "../middlewares/ValidateNoticiaMiddleware.js";
import { NoticiaService } from "../services/NoticiaService.js";
import { NoticiaController } from "../controllers/NoticiaController.js";

const noticiaService = new NoticiaService();

const noticiaController = new NoticiaController({ noticiaService });

const { create: createMiddleware, update: updateMiddleware } = ValidateNoticiaMiddleware;

const router = Router();

router.post("/", ensureAuthMiddleware, ensureAdminMiddleware, createMiddleware, (req, res, next) =>
	noticiaController.create(req, res, next),
);
router.get("/", (req, res, next) => noticiaController.list(req as any, res, next));

router.put("/:id", ensureAuthMiddleware, ensureAdminMiddleware, updateMiddleware, (req, res, next) =>
	noticiaController.update(req, res, next),
);
router.get("/:id", (req, res, next) => noticiaController.get(req, res, next));

router.delete("/:id", ensureAuthMiddleware, ensureAdminMiddleware, (req, res, next) =>
	noticiaController.delete(req as any, res, next),
);

export { router };
