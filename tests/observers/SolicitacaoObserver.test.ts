import { beforeAll, describe, expect, it } from "vitest";
import { ProjetoFactory, UsuarioAlunoFactory } from "../factories/index.js";
import { SolicitacaoObserver } from "../../src/observers/SolicitacaoObserver.js";
import { NotificacaoService } from "../../src/services/NotificacaoService.js";
import { TipoNotificacaoService } from "../../src/services/TipoNotificacaoService.js";
import { ProjetoService } from "../../src/services/ProjetoService.js";
import { SolicitacaoService } from "../../src/services/SolicitacaoService.js";
import { EstadoService } from "../../src/services/EstadoService.js";
import { UsuarioProjetoService } from "../../src/services/UsuarioProjetoService.js";
import { UsuarioService } from "../../src/services/UsuarioService.js";
import { ProfessorCategoriaService } from "../../src/services/ProfessorCategoriaService.js";
import { CategoriaService } from "../../src/services/CategoriaService.js";
import { SerieService } from "../../src/services/SerieService.js";
import { CursoService } from "../../src/services/CursoService.js";
import { AlunoService } from "../../src/services/AlunoService.js";
import { ProfessorService } from "../../src/services/ProfessorService.js";

describe("SolicitacaoObserver", () => {
	let defaultMembrosId: string[];
	let defaultProjetoId: string;
	let defaultSolicitacaoId: string;

	const tipoNotificacaoService = new TipoNotificacaoService();
	const notificacaoService = new NotificacaoService({ tipoNotificacaoService });
	const solicitacaoObserver = new SolicitacaoObserver({ notificacaoService });

	const prepararDadosTeste = async () => {
		const alunoService = new AlunoService();
		const professorService = new ProfessorService();
		const cursoService = new CursoService();
		const serieService = new SerieService();
		const categoriaService = new CategoriaService();
		const professorCategoriaService = new ProfessorCategoriaService({ categoriaService });
		const usuarioService = new UsuarioService({
			alunoService,
			professorService,
			cursoService,
			serieService,
			professorCategoriaService,
		});
		const usuarioProjetoService = new UsuarioProjetoService();
		const estadoService = new EstadoService();
		const projetoService = new ProjetoService({
			usuarioProjetoService,
			estadoService,
			categoriaService,
			usuarioService,
		});
		const tipoNotificacaoService = new TipoNotificacaoService();
		const notificacaoService = new NotificacaoService({ tipoNotificacaoService });
		const solicitacaoService = new SolicitacaoService({ projetoService, notificacaoService });

		const cursoId = (await cursoService.list()).at(0)?.id as string;
		const serieId = (await serieService.list()).at(0)?.id as string;
		const [primeiraCategoria] = await categoriaService.list();
		const [primeiroEstado] = await estadoService.list();

		const { nome, email, password, curso_id, serie_id } = UsuarioAlunoFactory.create()
			.withCurso(cursoId)
			.withSerie(serieId)
			.build();
		const input = { nome, email, password, curso_id, serie_id, tipo: "aluno" as const };
		const usuario = await usuarioService.create(input);

		const {
			nome: nomeProjeto,
			resumo,
			introducao,
			objetivo,
			conclusao,
			result_disc,
			categoria_id,
			estado_id,
			metodologia,
		} = ProjetoFactory.create()
			.withCategoria(String(primeiraCategoria?.id))
			.withEstado(String(primeiroEstado?.id))
			.withUsuarios([String(usuario.id)])
			.build();

		const projeto = await projetoService.create(
			{
				nome: nomeProjeto,
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
					user_id: String(usuario.id),
					relacao: "bolsista",
				},
			],
		);

		defaultProjetoId = String(projeto.id);

		const solicitacao = await solicitacaoService.create({
			titulo: "asd",
			descricao: "res",
			creator_id: String(usuario.id),
			projeto_id: defaultProjetoId,
		});

		defaultMembrosId = [String(usuario.id)];
		defaultSolicitacaoId = String(solicitacao.id);
	};

	beforeAll(async () => {
		await prepararDadosTeste();
	});

	it("deve retornar uma lista de notificacoes ao emitir created", async () => {
		const output = await solicitacaoObserver.created(defaultSolicitacaoId, defaultMembrosId);
		expect(output).instanceOf(Array);
		expect(output.length).toEqual(1);
		expect(output.map((notificacao) => notificacao.user_id)).toEqual(expect.arrayContaining(defaultMembrosId));
		expect(output.every((notificacao) => notificacao.solicitacao.id === defaultSolicitacaoId)).toBeTruthy();
	});
});
