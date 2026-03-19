import { beforeAll, describe, expect, it } from "vitest";
import { AlunoService } from "../../src/services/AlunoService.js";
import { CategoriaService } from "../../src/services/CategoriaService.js";
import { ProfessorService } from "../../src/services/ProfessorService.js";
import { ProfessorCategoriaService } from "../../src/services/ProfessorCategoriaService.js";
import { CursoService } from "../../src/services/CursoService.js";
import { SerieService } from "../../src/services/SerieService.js";
import { UsuarioService } from "../../src/services/UsuarioService.js";
import { UsuarioAlunoFactory } from "../factories/UsuarioAlunoFactory.js";
import { NoticiaService } from "../../src/services/NoticiaService.js";
import { NoticiaDTO } from "../../src/dto/NoticiaDTO.js";
import { v4 as uuidV4 } from "uuid";
import { NotFoundError } from "../../src/errors/NotFoundError.js";

describe("NoticiaService", () => {
	let defaultUsuarioId: string;

	const noticiaService = new NoticiaService();

	async function criarUsuario() {
		const cursoService = new CursoService();
		const serieService = new SerieService();
		const cursoId = (await cursoService.list()).at(0)?.id as string;
		const serieId = (await serieService.list()).at(0)?.id as string;
		const alunoService = new AlunoService();
		const categoriaService = new CategoriaService();
		const professorService = new ProfessorService();
		const professorCategoriaService = new ProfessorCategoriaService({ categoriaService });
		const service = new UsuarioService({
			alunoService,
			professorService,
			cursoService,
			serieService,
			professorCategoriaService,
		});

		const { nome, email, password, curso_id, serie_id } = UsuarioAlunoFactory.create()
			.withCurso(cursoId)
			.withSerie(serieId)
			.build();
		const usuario = await service.create({ nome, email, password, curso_id, serie_id, tipo: "aluno" });
		return usuario;
	}

	beforeAll(async () => {
		const usuario = await criarUsuario();
		defaultUsuarioId = String(usuario.id);
	});

	it("deve criar uma noticia", async () => {
		const output = await noticiaService.create({ link: "teste", nome: "teste", user_id: defaultUsuarioId });
		expect(output).instanceOf(NoticiaDTO);
		expect(output.id).toBeDefined();
	});

	it("deve encontrar uma noticia pelo ID", async () => {
		const input = await noticiaService.create({ link: "teste", nome: "teste", user_id: defaultUsuarioId });
		const output = await noticiaService.get(String(input.id));
		expect(output).instanceOf(NoticiaDTO);
		expect(output?.id).toEqual(input?.id);
	});

	it("deve atualizar as informações da noticia", async () => {
		const usuario = await criarUsuario();
		const noticia = await noticiaService.create({ link: "teste", nome: "teste", user_id: defaultUsuarioId });
		const output = await noticiaService.update(String(noticia.id), {
			nome: "atualizado",
			link: "atualizado",
			user_id: String(usuario.id),
		});
		expect(output.nome).toEqual("atualizado");
		expect(output.link).toEqual("atualizado");
		expect(output.user_id).toEqual(String(usuario.id));
	});

	it("deve não atualizar uma noticia inexistente", async () => {
		const fakeID = uuidV4();
		await expect(
			noticiaService.update(fakeID, { link: "teste", nome: "teste", user_id: defaultUsuarioId }),
		).rejects.toBeInstanceOf(NotFoundError);
	});

	it("deve deletar um noticia", async () => {
		const input = await noticiaService.create({ link: "teste", nome: "teste", user_id: defaultUsuarioId });
		const output = await noticiaService.delete(String(input.id));
		expect(output).toBeTruthy();
	});

	it("deve retornar uma lista de noticias paginada", async () => {
		const output = await noticiaService.list();
		expect(output).toHaveProperty("data");
		expect(output.data.every((noticia) => noticia instanceof NoticiaDTO)).toBeTruthy();
		expect(output).toHaveProperty("count");
		expect(output).toHaveProperty("page");
		expect(output).toHaveProperty("perPage");
		expect(output).toHaveProperty("totalPages");
	});

	it("deve aplicar filtros", async () => {
		const usuario = await criarUsuario();
		const outputNotFiltred = await noticiaService.list();
		const outputFiltred = await noticiaService.list({ filters: { user_id: String(usuario.id) } });
		expect(outputNotFiltred.count).not.toEqual(outputFiltred.count);
	});
});
