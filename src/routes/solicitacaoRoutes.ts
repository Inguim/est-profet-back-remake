import { Router } from "express";
import {
	AlunoService,
	CategoriaService,
	CursoService,
	EstadoService,
	ProfessorCategoriaService,
	ProfessorService,
	ProjetoService,
	SerieService,
	SolicitacaoService,
	UsuarioProjetoService,
	UsuarioService,
} from "../services/index.js";
import { ensureAuthMiddleware } from "../middlewares/EnsureAuthMiddleware.js";
import { SolicitacaoController } from "../controllers/index.js";
import { ensureAdminMiddleware } from "../middlewares/EnsureAdminMiddleware.js";
import { ValidateSolicitacaoMiddleware } from "../middlewares/ValidateSolicitacaoMiddleware.js";

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
const solicitacaoService = new SolicitacaoService({ projetoService });

const solicitacaoController = new SolicitacaoController({ solicitacaoService });

const { create: createMiddleware } = ValidateSolicitacaoMiddleware;

const router = Router();

router.post("/", ensureAuthMiddleware, ensureAdminMiddleware, createMiddleware, (req, res, next) =>
	solicitacaoController.create(req, res, next),
);
router.get("/", ensureAuthMiddleware, ensureAdminMiddleware, (req, res, next) =>
	solicitacaoController.list(req, res, next),
);
router.get("/:id", ensureAuthMiddleware, ensureAdminMiddleware, (req, res, next) =>
	solicitacaoController.get(req as any, res, next),
);
router.delete("/:id", ensureAuthMiddleware, ensureAdminMiddleware, (req, res, next) =>
	solicitacaoController.delete(req as any, res, next),
);

export { router };
