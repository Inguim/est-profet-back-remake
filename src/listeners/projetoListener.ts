import { eventBus } from "../events/index.js";
import { ProjetoObserver } from "../observers/index.js";
import { AlunoService } from "../services/AlunoService.js";
import { CategoriaService } from "../services/CategoriaService.js";
import { CursoService } from "../services/CursoService.js";
import { EstadoService } from "../services/EstadoService.js";
import { NotificacaoService } from "../services/NotificacaoService.js";
import { ProfessorCategoriaService } from "../services/ProfessorCategoriaService.js";
import { ProfessorService } from "../services/ProfessorService.js";
import { ProjetoService } from "../services/ProjetoService.js";
import { SerieService } from "../services/SerieService.js";
import { SolicitacaoService } from "../services/SolicitacaoService.js";
import { TipoNotificacaoService } from "../services/TipoNotificacaoService.js";
import { UsuarioProjetoService } from "../services/UsuarioProjetoService.js";
import { UsuarioService } from "../services/UsuarioService.js";

eventBus.on("projeto.updated", async ({ executerId, projetoId }) => {
	const usuarioProjetoService = new UsuarioProjetoService();
	const estadoService = new EstadoService();
	const categoriaService = new CategoriaService();
	const alunoService = new AlunoService();
	const professorService = new ProfessorService();
	const cursoService = new CursoService();
	const serieService = new SerieService();
	const professorCategoriaService = new ProfessorCategoriaService({ categoriaService });
	const usuarioService = new UsuarioService({
		alunoService,
		professorService,
		cursoService,
		serieService,
		professorCategoriaService,
	});
	const projetoService = new ProjetoService({ usuarioProjetoService, estadoService, categoriaService, usuarioService });
	const tipoNotificacaoService = new TipoNotificacaoService();
	const notificacaoService = new NotificacaoService({ tipoNotificacaoService });
	const solicitacaoService = new SolicitacaoService({ notificacaoService, projetoService });

	const observer = new ProjetoObserver({ notificacaoService, solicitacaoService });
	observer.updated(projetoId, executerId);
});
