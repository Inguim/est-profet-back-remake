import { Router } from "express";
import { AuthController } from "../controllers/index.js";
import { AuthService } from "../services/AuthService.js";
import {
	AlunoService,
	CategoriaService,
	CursoService,
	PasswordResetService,
	PasswordService,
	ProfessorCategoriaService,
	ProfessorService,
	SerieService,
	TokenService,
	UsuarioService,
} from "../services/index.js";

const passwordService = new PasswordService();
const tokenService = new TokenService();
const alunoService = new AlunoService();
const categoriaService = new CategoriaService();
const professorService = new ProfessorService();
const professorCategoriaService = new ProfessorCategoriaService({ categoriaService });
const cursoService = new CursoService();
const serieService = new SerieService();
const usuarioService = new UsuarioService({
	alunoService,
	professorService,
	professorCategoriaService,
	cursoService,
	serieService,
});

const authService = new AuthService({ passwordService, tokenService, usuarioService });
const passwordResetService = new PasswordResetService({ usuarioService });
const authController = new AuthController(authService, passwordResetService);

const router = Router();

router.post("/login", (req, res, next) => authController.login(req, res, next));
router.post("/password-reset", (req, res, next) => authController.solicitarResetPassword(req, res, next));
router.patch("/password-reset", (req, res, next) => authController.efetuarResetPassword(req, res, next));

export { router };
