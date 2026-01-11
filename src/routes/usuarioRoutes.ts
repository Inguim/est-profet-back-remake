import { Router } from "express";
import { UsuarioController } from "../controllers/index.js";
import { UsuarioService } from "../services/index.js";
import { ValidateUsuarioMiddleware } from "../middlewares/index.js";

const { create: createMiddleware } = ValidateUsuarioMiddleware;

const router = Router();
const usuarioController = new UsuarioController({ usuarioService: new UsuarioService() });

router.post("/usuarios", createMiddleware, (req, res, next) => usuarioController.create(req, res, next));

export { router };
