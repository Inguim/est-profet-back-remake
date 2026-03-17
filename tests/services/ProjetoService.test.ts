import { beforeAll, describe, expect, it } from "vitest";
import { UsuarioProjetoService } from "../../src/services/UsuarioProjetoService.js";
import { EstadoService } from "../../src/services/EstadoService.js";
import { CategoriaService } from "../../src/services/CategoriaService.js";
import type { CategoriaDTO } from "../../src/dto/CategoriaDTO.js";
import type { EstadoDTO } from "../../src/dto/EstadoDTO.js";
import { UsuarioProfessorFactory } from "../factories/UsuarioProfessorFactory.js";
import { ProjetoFactory } from "../factories/ProjetoFactory.js";
import { ProjetoService } from "../../src/services/ProjetoService.js";
import { ProjetoCompletoDTO } from "../../src/dto/ProjetoCompletoDTO.js";
import { UsuarioService } from "../../src/services/UsuarioService.js";
import { AlunoService } from "../../src/services/AlunoService.js";
import { ProfessorService } from "../../src/services/ProfessorService.js";
import { CursoService } from "../../src/services/CursoService.js";
import { SerieService } from "../../src/services/SerieService.js";
import { ProfessorCategoriaService } from "../../src/services/ProfessorCategoriaService.js";
import { UsuarioAlunoFactory } from "../factories/UsuarioAlunoFactory.js";
import type { CursoDTO } from "../../src/dto/CursoDTO.js";
import type { SerieDTO } from "../../src/dto/SerieDTO.js";

describe("ProjetoService", () => {
	let defaultCategoriaId: string;
	let defaultEstadoId: string;
	let defaultCursoId: string;
	let defaultSerieId: string;
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

	async function preencherDefaults() {
		const [primeiroCurso] = await cursoService.list();
		const [primeiraSerie] = await serieService.list();
		const [primeiraCategoria] = await categoriaService.list();
		const [primeiroEstado] = await estadoService.list();
		defaultCategoriaId = String((primeiraCategoria as CategoriaDTO).id);
		defaultEstadoId = String((primeiroEstado as EstadoDTO).id);
		defaultCursoId = String((primeiroCurso as CursoDTO).id);
		defaultSerieId = String((primeiraSerie as SerieDTO).id);
	}

	async function gerarProjetoCompleto() {
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
		await preencherDefaults();
		await gerarProjetoCompleto();
	});

	it("deve atualizar as informações de um projeto", async () => {
		const output = await projetoService.update(defaultProjetoId, {
			nome: "alterado",
			conclusao: "alterado",
			introducao: "alterado",
			metodologia: "alterado",
			objetivo: "alterado",
			result_disc: "alterado",
			resumo: "alterado",
			status: "aprovado",
			executer_id: defaultUserId,
		});
		expect(output.nome).toEqual("alterado");
		expect(output.conclusao).toEqual("alterado");
		expect(output.introducao).toEqual("alterado");
		expect(output.metodologia).toEqual("alterado");
		expect(output.objetivo).toEqual("alterado");
		expect(output.result_disc).toEqual("alterado");
		expect(output.resumo).toEqual("alterado");
		expect(output.status).toEqual("aprovado");
	});

	it("deve retornar uma lista de projetos paginada", async () => {
		const output = await projetoService.list();
		expect(output).toHaveProperty("data");
		expect(output.data.every((projeto) => projeto instanceof ProjetoCompletoDTO)).toBeTruthy();
		expect(output).toHaveProperty("count");
		expect(output).toHaveProperty("page");
		expect(output).toHaveProperty("perPage");
		expect(output).toHaveProperty("totalPages");
	});

	it("deve retornar os alunos do projeto", async () => {
		const projetos = await projetoService.list();
		const projeto = projetos.data.find((projeto) => projeto.id === defaultProjetoId);
		if (projeto) {
			expect(projeto.alunos.length).toBeGreaterThan(0);
		}
	});

	it("deve retornar os professores do projeto", async () => {
		const projetos = await projetoService.list();
		const projeto = projetos.data.find((projeto) => projeto.id === defaultProjetoId);
		if (projeto) {
			expect(projeto.professores.length).toBeGreaterThan(0);
		}
	});

	it("deve aplicar filtros", async () => {
		const outputNotFiltred = await projetoService.list();
		const outputFiltred = await projetoService.list({ filters: { status: "aprovado" } });
		expect(outputNotFiltred.count).not.toEqual(outputFiltred.count);
	});

	it("deve encontrar um projeto pelo ID", async () => {
		const output = await projetoService.get(defaultProjetoId);
		expect(output.id).toBeDefined();
		expect(output).toBeInstanceOf(ProjetoCompletoDTO);
	});

	it("deve alterar o STATUS de um projeto pelo ID", async () => {
		const output = await projetoService.updateStatus(defaultProjetoId, "aprovado");
		expect(output.status).toEqual("aprovado");
	});

	it("deve excluir um projeto pelo ID", async () => {
		const output = await projetoService.delete(defaultProjetoId);
		expect(output).toBeTruthy();
	});
});
