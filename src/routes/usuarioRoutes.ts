import { Router } from "express";
import { UsuarioController } from "../controllers/index.js";
import { UsuarioService } from "../services/index.js";
import { ensureAuthMiddleware, ValidateUsuarioMiddleware } from "../middlewares/index.js";

const { create: createMiddleware, update: updateMiddleware } = ValidateUsuarioMiddleware;

const router = Router();
const usuarioController = new UsuarioController({ usuarioService: new UsuarioService() });

router.post("/", createMiddleware, (req, res, next) => usuarioController.create(req, res, next));
router.patch("/:id", ensureAuthMiddleware, updateMiddleware, (req, res, next) =>
	usuarioController.update(req, res, next),
);
router.get("/:id", ensureAuthMiddleware, (req, res, next) => usuarioController.get(req as any, res, next));

export { router };
