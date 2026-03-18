import { beforeAll, describe, expect, it, vi } from "vitest";
import {
	AlunoService,
	CategoriaService,
	CursoService,
	ProfessorCategoriaService,
	ProfessorService,
	SerieService,
	TipoContribuicaoService,
	UsuarioService,
} from "../../src/services/index.js";
import { UsuarioAlunoFactory } from "../factories/UsuarioAlunoFactory.js";
import type { CursoDTO } from "../../src/dto/CursoDTO.js";
import type { SerieDTO } from "../../src/dto/SerieDTO.js";
import { ContribuidorService } from "../../src/services/ContribuidorService.js";
import { type IGitHubProvider } from "../../src/providers/GitHubProvider.js";
import { ContribuidorDTO } from "../../src/dto/ContribuidorDTO.js";

describe("ContribuidorService", () => {
	let defaultUserId: string;
	let defaultTipoId: string;

	const mockGitHubProvider: IGitHubProvider = {
		getUserInfo: vi.fn().mockImplementation(async (username: string) => {
			if (username === "teste") {
				return {
					username: "teste",
					bio: "mock bio",
					git: "mockgit",
					cover_url: "mock-url",
				};
			}
			return null;
		}),
	};

	const tipoContribuicaoService = new TipoContribuicaoService();
	const contribuidorService = new ContribuidorService({ gitHubProvider: mockGitHubProvider });

	async function preencherDefaults() {
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

		const [primeiroCurso] = await cursoService.list();
		const [primeiraSerie] = await serieService.list();
		const defaultCursoId = String((primeiroCurso as CursoDTO).id);
		const defaultSerieId = String((primeiraSerie as SerieDTO).id);

		const { nome, email, password, curso_id, serie_id } = UsuarioAlunoFactory.create()
			.withCurso(defaultCursoId)
			.withSerie(defaultSerieId)
			.build();

		const usuario = await usuarioService.create({
			nome,
			email,
			tipo: "aluno",
			password,
			curso_id,
			serie_id,
		});
		defaultUserId = String(usuario.id);

		const tipo = await tipoContribuicaoService.get("idealizador_desenvolvedor");
		defaultTipoId = String(tipo.id);
	}

	beforeAll(async () => {
		await preencherDefaults();
	});

	it("deve criar um contribuidor", async () => {
		const output = await contribuidorService.create({
			user_id: defaultUserId,
			tipo_contribuicao_id: defaultTipoId,
			github_username: "teste",
		});
		expect(output.id).toBeDefined();
	});

	it("deve encontrar um contribuidor pelo ID", async () => {
		const input = await contribuidorService.create({
			user_id: defaultUserId,
			tipo_contribuicao_id: defaultTipoId,
			github_username: "teste",
		});
		const output = await contribuidorService.get(String(input.id));
		expect(output.id).toEqual(input.id);
	});

	it("deve encontrar um contribuidor pelo ID e retornar os dados do GitHubAccount", async () => {
		const input = await contribuidorService.create({
			user_id: defaultUserId,
			tipo_contribuicao_id: defaultTipoId,
			github_username: "teste",
		});
		const output = await contribuidorService.get(String(input.id));
		expect(output.id).toEqual(input.id);
		expect(output.github_dados).not.toBeNull();
	});

	it("deve encontrar um contribuidor pelo ID e retornar os null para os dados de GitHubAccount", async () => {
		const input = await contribuidorService.create({
			user_id: defaultUserId,
			tipo_contribuicao_id: defaultTipoId,
			github_username: "sem conta",
		});
		const output = await contribuidorService.get(String(input.id));
		expect(output.id).toEqual(input.id);
		expect(output.github_dados).toBeNull();
	});

	it("deve atualizar as informações de um contribuidor", async () => {
		const input = await contribuidorService.create({
			user_id: defaultUserId,
			tipo_contribuicao_id: defaultTipoId,
			github_username: "teste",
		});
		const inputTipo = await tipoContribuicaoService.get("apoio_manutencao");
		const output = await contribuidorService.update(String(input.id), {
			tipo_contribuicao_id: String(inputTipo.id),
			github_username: "alterado",
		});
		expect(output.tipo_contribuicao.id).toEqual(inputTipo.id);
		expect(output.github_username).toEqual("alterado");
	});

	it("deve retornar uma lista de contribuidores paginada", async () => {
		await contribuidorService.create({
			user_id: defaultUserId,
			tipo_contribuicao_id: defaultTipoId,
			github_username: "teste",
		});
		const output = await contribuidorService.list();
		expect(output).toHaveProperty("data");
		expect(output.data.every((contribuidor) => contribuidor instanceof ContribuidorDTO)).toBeTruthy();
		expect(output).toHaveProperty("count");
		expect(output).toHaveProperty("page");
		expect(output).toHaveProperty("perPage");
		expect(output).toHaveProperty("totalPages");
	});

	it("deve deletar um contribuidor pelo ID", async () => {
		const input = await contribuidorService.create({
			user_id: defaultUserId,
			tipo_contribuicao_id: defaultTipoId,
			github_username: "teste",
		});
		const output = await contribuidorService.delete(String(input.id));
		expect(output).toBeTruthy();
	});
});
