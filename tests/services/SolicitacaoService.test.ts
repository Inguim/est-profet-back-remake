import { beforeAll, describe, expect, it } from "vitest";
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
} from "../../src/services/index.js";
import { UsuarioAlunoFactory } from "../factories/UsuarioAlunoFactory.js";
import { ProjetoFactory } from "../factories/ProjetoFactory.js";
import { SolicitacaoService } from "../../src/services/SolicitacaoService.js";
import { SolicitacaoDTO } from "../../src/dto/SolicitacaoDTO.js";

describe("SolicitacaoService", () => {
	let defaultProjetoId: string;
	let defaultCreatorId: string;

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
	const solicitacaoService = new SolicitacaoService({ projetoService });

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
