import { Router } from "express";
import { TipoContribuicaoController } from "../controllers/index.js";
import { TipoContribuicaoService } from "../services/index.js";
import { ensureAuthMiddleware } from "../middlewares/EnsureAuthMiddleware.js";
import { ensureAdminMiddleware } from "../middlewares/EnsureAdminMiddleware.js";

const router = Router();
const tipoContribuicaoController = new TipoContribuicaoController({ tipoContribuicao: new TipoContribuicaoService() });

router.get("/", ensureAuthMiddleware, ensureAdminMiddleware, (req, res, next) =>
	tipoContribuicaoController.list(req, res, next),
);

export { router };
