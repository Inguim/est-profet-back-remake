import { Router } from "express";
import { AuthController } from "../controllers/index.js";
import { AuthService } from "../services/AuthService.js";
import { AlunoService, PasswordService, TokenService, UsuarioService } from "../services/index.js";

const passwordService = new PasswordService();
const tokenService = new TokenService();
const alunoService = new AlunoService();
const usuarioService = new UsuarioService({ alunoService });

const authService = new AuthService({ passwordService, tokenService, usuarioService });
const authController = new AuthController(authService);

const router = Router();

router.post("/login", (req, res, next) => authController.login(req, res, next));

export { router };
