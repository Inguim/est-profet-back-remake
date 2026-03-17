import { Router } from "express";
import { ProjetoController } from "../controllers/index.js";
import {
	AlunoService,
	CategoriaService,
	CursoService,
	EstadoService,
	ProfessorCategoriaService,
	ProfessorService,
	ProjetoService,
	SerieService,
	UsuarioProjetoService,
	UsuarioService,
} from "../services/index.js";
import { ensureAuthMiddleware, ValidateProjetoMiddleware } from "../middlewares/index.js";

const {
	create: createMiddleware,
	update: updateMiddleware,
	updateStatus: updateStatusMiddleware,
} = ValidateProjetoMiddleware;

const estadoService = new EstadoService();
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
const usuarioProjetoService = new UsuarioProjetoService();
const projetoService = new ProjetoService({ usuarioService, categoriaService, estadoService, usuarioProjetoService });

const router = Router();
const projetoController = new ProjetoController({ projetoService, usuarioProjetoService });

router.post("/", ensureAuthMiddleware, createMiddleware, (req, res, next) =>
	projetoController.create(req as any, res, next),
);
router.get("/", (req, res, next) => projetoController.list(req, res, next));

router.put("/:id", ensureAuthMiddleware, updateMiddleware, (req, res, next) =>
	projetoController.update(req, res, next),
);
router.get("/:id", (req, res, next) => projetoController.get(req, res, next));
router.delete("/:id", ensureAuthMiddleware, (req, res, next) => projetoController.delete(req as any, res, next));

router.patch("/:id/status", ensureAuthMiddleware, updateStatusMiddleware, (req, res, next) =>
	projetoController.updateStatus(req, res, next),
);

export { router };
