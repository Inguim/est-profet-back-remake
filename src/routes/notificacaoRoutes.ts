import { Router } from "express";
import { NotificacaoController } from "../controllers/index.js";
import { ensureAuthMiddleware } from "../middlewares/index.js";
import { NotificacaoService } from "../services/NotificacaoService.js";
import { TipoNotificacaoService } from "../services/TipoNotificacaoService.js";

const tipoNotificacaoService = new TipoNotificacaoService();
const notificacaoService = new NotificacaoService({ tipoNotificacaoService });

const notificacaoController = new NotificacaoController({ notificacaoService });

const router = Router();

router.get("/", ensureAuthMiddleware, (req, res, next) => notificacaoController.list(req, res, next));

router.get("/:id", ensureAuthMiddleware, (req, res, next) => notificacaoController.get(req as any, res, next));
router.patch("/:id/marcar-lida", ensureAuthMiddleware, (req, res, next) =>
	notificacaoController.marcarLida(req as any, res, next),
);

export { router };
