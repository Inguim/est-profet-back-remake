import { Router } from "express";
import { EstadoController } from "../controllers/index.js";
import { EstadoService } from "../services/index.js";
import { ensureAuthMiddleware } from "../middlewares/EnsureAuthMiddleware.js";

const router = Router();
const cursoController = new EstadoController({ estadoService: new EstadoService() });

router.get("/", ensureAuthMiddleware, (req, res, next) => cursoController.list(req, res, next));

export { router };
