import { beforeAll, describe, expect, it } from "vitest";
import { UsuarioProjetoService } from "../../src/services/UsuarioProjetoService.js";
import { EstadoService } from "../../src/services/EstadoService.js";
import { CategoriaService } from "../../src/services/CategoriaService.js";
import type { CategoriaDTO } from "../../src/dto/CategoriaDTO.js";
import type { EstadoDTO } from "../../src/dto/EstadoDTO.js";
import { UsuarioProfessorFactory } from "../factories/UsuarioProfessorFactory.js";
import { ProjetoFactory } from "../factories/ProjetoFactory.js";
import { ProjetoService } from "../../src/services/ProjetoService.js";
import { UsuarioService } from "../../src/services/UsuarioService.js";
import { AlunoService } from "../../src/services/AlunoService.js";
import { ProfessorService } from "../../src/services/ProfessorService.js";
import { CursoService } from "../../src/services/CursoService.js";
import { SerieService } from "../../src/services/SerieService.js";
import { ProfessorCategoriaService } from "../../src/services/ProfessorCategoriaService.js";
import { UsuarioAlunoFactory } from "../factories/UsuarioAlunoFactory.js";
import type { CursoDTO } from "../../src/dto/CursoDTO.js";
import type { SerieDTO } from "../../src/dto/SerieDTO.js";
import { ProjetoObserver } from "../../src/observers/ProjetoObserver.js";
import { SolicitacaoService } from "../../src/services/SolicitacaoService.js";
import { TipoNotificacaoService } from "../../src/services/TipoNotificacaoService.js";
import { NotificacaoService } from "../../src/services/NotificacaoService.js";
import { NotificacaoDTO } from "../../src/dto/NotificacaoDTO.js";

describe("ProjetoObserver", () => {
	let defaultProjetoId: string;
	let defaultUserId: string;
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

	const projetoObserver = new ProjetoObserver({ notificacaoService, solicitacaoService });

	async function gerarProjetoCompleto() {
		const [primeiroCurso] = await cursoService.list();
		const [primeiraSerie] = await serieService.list();
		const [primeiraCategoria] = await categoriaService.list();
		const [primeiroEstado] = await estadoService.list();
		const defaultCategoriaId = String((primeiraCategoria as CategoriaDTO).id);
		const defaultEstadoId = String((primeiroEstado as EstadoDTO).id);
		const defaultCursoId = String((primeiroCurso as CursoDTO).id);
		const defaultSerieId = String((primeiraSerie as SerieDTO).id);

		const usuarioAlunoFake = UsuarioAlunoFactory.create().withCurso(defaultCursoId).withSerie(defaultSerieId).build();
		const usuarioProfessorFake = UsuarioProfessorFactory.create()
			.withNome("lazim")
			.withCategorias([defaultCategoriaId])
			.build();
		const usuarioProfessor = await usuarioService.create({
			nome: usuarioProfessorFake.nome,
			email: usuarioProfessorFake.email,
			tipo: "professor",
			password: usuarioProfessorFake.password,
			categoriaIds: usuarioProfessorFake.categorias,
		});
		const usuarioAluno = await usuarioService.create({
			nome: usuarioAlunoFake.nome,
			email: usuarioAlunoFake.email,
			tipo: "aluno",
			password: usuarioAlunoFake.password,
			curso_id: usuarioAlunoFake.curso_id,
			serie_id: usuarioAlunoFake.serie_id,
		});

		const { nome, resumo, introducao, objetivo, conclusao, result_disc, categoria_id, estado_id, metodologia } =
			ProjetoFactory.create()
				.withStatus("analise")
				.withCategoria(defaultCategoriaId)
				.withEstado(defaultEstadoId)
				.withUsuarios([String(usuarioProfessor.id), String(usuarioAluno.id)])
				.build();
		const { id } = await projetoService.create(
			{
				nome,
				resumo,
				introducao,
				objetivo,
				conclusao,
				result_disc,
				categoria_id,
				estado_id,
				metodologia,
			},
			[
				{
					user_id: String(usuarioAluno.id),
					relacao: "bolsista",
				},
				{
					user_id: String(usuarioProfessor.id),
					relacao: "orientador",
				},
			],
		);
		defaultProjetoId = String(id);
		defaultUserId = String(usuarioAluno.id);
	}

	beforeAll(async () => {
		await gerarProjetoCompleto();
	});

	it("deve retornar NULL caso projeto não possua solicitação", async () => {
		const output = await projetoObserver.updated(defaultProjetoId, defaultUserId);
		expect(output).toBeNull();
	});

	it("deve retornar uma NotificacaoDTO", async () => {
		await solicitacaoService.create({
			creator_id: defaultUserId,
			projeto_id: defaultProjetoId,
			titulo: "teste",
			descricao: "teste",
		});
		const output = await projetoObserver.updated(defaultProjetoId, defaultUserId);
		expect(output).toBeInstanceOf(NotificacaoDTO);
	});
});
