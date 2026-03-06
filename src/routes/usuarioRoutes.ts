import { Router } from "express";
import { UsuarioController } from "../controllers/index.js";
import {
	AlunoService,
	CategoriaService,
	CursoService,
	ProfessorCategoriaService,
	ProfessorService,
	SerieService,
	UsuarioService,
} from "../services/index.js";
import { ensureAuthMiddleware, ValidateUsuarioMiddleware } from "../middlewares/index.js";

const { create: createMiddleware, update: updateMiddleware } = ValidateUsuarioMiddleware;

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

const router = Router();
const usuarioController = new UsuarioController({ usuarioService });

router.post("/", createMiddleware, (req, res, next) => usuarioController.create(req as any, res, next));
router.get("/", (req, res, next) => usuarioController.list(req, res, next));
router.patch("/:id", ensureAuthMiddleware, updateMiddleware, (req, res, next) =>
	usuarioController.update(req, res, next),
);
router.get("/:id", ensureAuthMiddleware, (req, res, next) => usuarioController.get(req as any, res, next));

export { router };
