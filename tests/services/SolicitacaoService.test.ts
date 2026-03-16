import { beforeAll, describe, expect, it } from "vitest";
import {
	AlunoService,
	CategoriaService,
	CursoService,
	EstadoService,
	NotificacaoService,
	ProfessorCategoriaService,
	ProfessorService,
	ProjetoService,
	SerieService,
	TipoNotificacaoService,
	UsuarioProjetoService,
	UsuarioService,
} from "../../src/services/index.js";
import { UsuarioAlunoFactory } from "../factories/UsuarioAlunoFactory.js";
import { ProjetoFactory } from "../factories/ProjetoFactory.js";
import { SolicitacaoService } from "../../src/services/SolicitacaoService.js";
import { SolicitacaoDTO } from "../../src/dto/SolicitacaoDTO.js";

describe("SolicitacaoService", () => {
	let defaultProjetoId: string;
	let defaultCreatorId: string;
	let defaultUserId: string;

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

	const prepararDadosTest = async () => {
		const projetoService = new ProjetoService({
			usuarioProjetoService,
			estadoService,
			categoriaService,
			usuarioService,
		});

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
		defaultUserId = String(usuario.id);

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

		const { id } = await projetoService.create(
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

		defaultCreatorId = String(usuario.id);
		defaultProjetoId = String(id);
	};

	beforeAll(async () => {
		await prepararDadosTest();
	});

	it("deve criar uma solicitação", async () => {
		const output = await solicitacaoService.create({
			titulo: "asd",
			descricao: "res",
			creator_id: defaultCreatorId,
			projeto_id: defaultProjetoId,
		});
		expect(output).toBeInstanceOf(SolicitacaoDTO);
		expect(output.id).not.toBeNull();
	});

	it("deve encontrar uma solicitação pelo ID", async () => {
		const input = await solicitacaoService.create({
			titulo: "asd",
			descricao: "res",
			creator_id: defaultCreatorId,
			projeto_id: defaultProjetoId,
		});
		const output = await solicitacaoService.get(String(input.id));
		expect(output).toBeInstanceOf(SolicitacaoDTO);
		expect(output?.id).toEqual(input?.id);
	});

	it("deve trazer informações do projeto ao buscar pelo ID", async () => {
		const input = await solicitacaoService.create({
			titulo: "asd",
			descricao: "res",
			creator_id: defaultCreatorId,
			projeto_id: defaultProjetoId,
		});
		const output = await solicitacaoService.get(String(input.id));
		expect(output).toBeInstanceOf(SolicitacaoDTO);
		expect(output?.projeto).toBeDefined();
		expect(output?.projeto).instanceOf(Object);
		expect(output?.projeto).toHaveProperty("id");
		expect(output?.projeto).toHaveProperty("nome");
	});

	it("deve alterar apenas os dados de uma solicitação pelo ID", async () => {
		const input = await solicitacaoService.create({
			titulo: "asd",
			descricao: "res",
			creator_id: defaultCreatorId,
			projeto_id: defaultProjetoId,
		});
		const output = await solicitacaoService.update(String(input.id), {
			tipo_alteracao: "alteracao_dados",
			titulo: "alterado",
			descricao: "alterao",
		});
		expect(input.titulo).not.toEqual(output.titulo);
		expect(input.descricao).not.toEqual(output.descricao);
	});

	it("deve alterar o STATUS do PROJETO e o VISTO da NOTIFICACAO caso a solicitacao possua NOTIFICACAO", async () => {
		const input = await solicitacaoService.create({
			titulo: "asd",
			descricao: "res",
			creator_id: defaultCreatorId,
			projeto_id: defaultProjetoId,
		});
		const notificacao = await notificacaoService.create({ solicitacao_id: String(input.id), user_id: defaultUserId });
		const outputSolicitacao = await solicitacaoService.update(String(input.id), {
			tipo_alteracao: "solicitar_analise",
			status: "recusado",
		});
		const outputProjeto = await projetoService.get(outputSolicitacao.projeto_id);
		const notificacaoOutput = await notificacaoService.get(String(notificacao.id));
		expect(outputSolicitacao.status).toEqual("recusado");
		expect(outputProjeto.status.value).toEqual("analise");
		expect(notificacaoOutput.visto).toBeTruthy();
	});

	it("deve aprovar o PROJETO ao atualizar solicitacao com usando o tipo APROVACAO", async () => {
		const input = await solicitacaoService.create({
			titulo: "asd",
			descricao: "res",
			creator_id: defaultCreatorId,
			projeto_id: defaultProjetoId,
		});
		await notificacaoService.create({ solicitacao_id: String(input.id), user_id: defaultUserId });
		const outputSolicitacao = await solicitacaoService.update(String(input.id), {
			tipo_alteracao: "aprovacao",
			status: "aprovado",
		});
		const outputProjeto = await projetoService.get(outputSolicitacao.projeto_id);
		expect(outputSolicitacao.status).toEqual("aprovado");
		expect(outputProjeto.status.value).toEqual("aprovado");
	});

	it("deve deletar uma solicitação pelo ID", async () => {
		const input = await solicitacaoService.create({
			titulo: "asd",
			descricao: "res",
			creator_id: defaultCreatorId,
			projeto_id: defaultProjetoId,
		});
		const output = await solicitacaoService.delete(String(input.id));
		expect(output).toBeTruthy();
	});

	it("deve retornar uma lista de solicitações paginada", async () => {
		const output = await solicitacaoService.list();
		expect(output).toHaveProperty("data");
		expect(output.data.every((projeto) => projeto instanceof SolicitacaoDTO)).toBeTruthy();
		expect(output).toHaveProperty("count");
		expect(output).toHaveProperty("page");
		expect(output).toHaveProperty("perPage");
		expect(output).toHaveProperty("totalPages");
	});

	it("deve aplicar filtros", async () => {
		const outputNotFiltred = await solicitacaoService.list();
		const outputFiltred = await solicitacaoService.list({ filters: { status: "recusado" } });
		expect(outputNotFiltred.count).not.toEqual(outputFiltred.count);
	});
});
