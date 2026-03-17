import { beforeAll, describe, expect, it } from "vitest";
import { CategoriaModel, EstadoModel, ProjetoModel } from "../../src/models/index.js";
import { CategoriaDTO, EstadoDTO, PROJETO_STATUS_VALUES, ProjetoDTO } from "../../src/dto/index.js";
import { ProjetoFactory } from "../factories/index.js";

describe("ProjetoModel", () => {
	let defaultCategoriaId: string;
	let defaultRandomCategoriaId: string;
	let defaultEstadoId: string;
	let defaultRandomEstadoId: string;
	const projetoModel = new ProjetoModel();

	beforeAll(async () => {
		const categoriasModel = new CategoriaModel();
		const estadoModel = new EstadoModel();
		const [primeiraCategoria, segundaCategoria] = await categoriasModel.list();
		const [primeiroEstado, segundoEstado] = await estadoModel.list();
		defaultCategoriaId = String((primeiraCategoria as CategoriaDTO).id);
		defaultRandomCategoriaId = String((segundaCategoria as CategoriaDTO).id);
		defaultEstadoId = String((primeiroEstado as EstadoDTO).id);
		defaultRandomEstadoId = String((segundoEstado as EstadoDTO).id);
	});

	it("deve retornar um ProjetoDTO ao criar", async () => {
		const { nome, resumo, introducao, objetivo, metodologia, result_disc, conclusao, status, categoria_id, estado_id } =
			ProjetoFactory.create().withCategoria(defaultCategoriaId).withEstado(defaultEstadoId).build();
		const output = await projetoModel.create({
			nome,
			resumo,
			introducao,
			objetivo,
			metodologia,
			result_disc,
			conclusao,
			status,
			categoria_id,
			estado_id,
		});
		expect(output).toBeInstanceOf(ProjetoDTO);
		await projetoModel.delete(String(output.id));
	});

	it("deve encontrar um projeto pelo ID", async () => {
		const { nome, resumo, introducao, objetivo, metodologia, result_disc, conclusao, status, categoria_id, estado_id } =
			ProjetoFactory.create().withCategoria(defaultCategoriaId).withEstado(defaultEstadoId).build();
		const input = await projetoModel.create({
			nome,
			resumo,
			introducao,
			objetivo,
			metodologia,
			result_disc,
			conclusao,
			status,
			categoria_id,
			estado_id,
		});
		const output = await projetoModel.get(String(input.id));
		expect(output.id).toEqual(input.id);
		await projetoModel.delete(String(output.id));
	});

	it("deve atualizar os campos de um projeto", async () => {
		const { nome, resumo, introducao, objetivo, metodologia, result_disc, conclusao, status, categoria_id, estado_id } =
			ProjetoFactory.create()
				.withStatus("analise")
				.withCategoria(defaultCategoriaId)
				.withEstado(defaultEstadoId)
				.build();
		const projeto = await projetoModel.create({
			nome,
			resumo,
			introducao,
			objetivo,
			metodologia,
			result_disc,
			conclusao,
			status,
			categoria_id,
			estado_id,
		});
		const output = await projetoModel.update(String(projeto.id), {
			status: "aprovado",
			nome: "atualizado",
			resumo: "atualizado",
			introducao: "atualizado",
			objetivo: "atualizado",
			metodologia: "atualizado",
			result_disc: "atualizado",
			conclusao: "atualizado",
		});
		expect(output.status).toEqual("aprovado");
		expect(output.nome).toEqual("atualizado");
		expect(output.resumo).toEqual("atualizado");
		expect(output.introducao).toEqual("atualizado");
		expect(output.objetivo).toEqual("atualizado");
		expect(output.metodologia).toEqual("atualizado");
		expect(output.result_disc).toEqual("atualizado");
		expect(output.conclusao).toEqual("atualizado");
		await projetoModel.delete(String(output.id));
	});

	it("deve excluir um projeto pelo ID", async () => {
		const { nome, resumo, introducao, objetivo, metodologia, result_disc, conclusao, status, categoria_id, estado_id } =
			ProjetoFactory.create().withCategoria(defaultCategoriaId).withEstado(defaultEstadoId).build();
		const projeto = await projetoModel.create({
			nome,
			resumo,
			introducao,
			objetivo,
			metodologia,
			result_disc,
			conclusao,
			status,
			categoria_id,
			estado_id,
		});
		const output = await projetoModel.delete(String(projeto.id));
		expect(output.id).toBeNull();
	});

	it("deve retornar uma lista paginada", async () => {
		const { nome, resumo, introducao, objetivo, metodologia, result_disc, conclusao, status, categoria_id, estado_id } =
			ProjetoFactory.create().withCategoria(defaultCategoriaId).withEstado(defaultEstadoId).build();
		const projeto = await projetoModel.create({
			nome,
			resumo,
			introducao,
			objetivo,
			metodologia,
			result_disc,
			conclusao,
			status,
			categoria_id,
			estado_id,
		});
		const output = await projetoModel.list();
		expect(output).toHaveProperty("data");
		expect(output).toHaveProperty("page");
		expect(output).toHaveProperty("perPage");
		expect(output).toHaveProperty("count");
		expect(output).toHaveProperty("totalPages");
		await projetoModel.delete(String(projeto.id));
	});

	it("deve retornar uma lista de ProjetoDTO", async () => {
		const { nome, resumo, introducao, objetivo, metodologia, result_disc, conclusao, status, categoria_id, estado_id } =
			ProjetoFactory.create().withCategoria(defaultCategoriaId).withEstado(defaultEstadoId).build();
		const projeto = await projetoModel.create({
			nome,
			resumo,
			introducao,
			objetivo,
			metodologia,
			result_disc,
			conclusao,
			status,
			categoria_id,
			estado_id,
		});
		const output = await projetoModel.list();
		expect(output.data).instanceOf(Array);
		expect(output.data.every((projeto) => projeto instanceof ProjetoDTO)).toBeTruthy();
		await projetoModel.delete(String(projeto.id));
	});

	it.each(PROJETO_STATUS_VALUES)("deve retornar apenas projetos com o STATUS: %s", async (status) => {
		const { nome, resumo, introducao, objetivo, metodologia, result_disc, conclusao, categoria_id, estado_id } =
			ProjetoFactory.create().withStatus(status).withCategoria(defaultCategoriaId).withEstado(defaultEstadoId).build();
		const projeto = await projetoModel.create({
			nome,
			resumo,
			introducao,
			objetivo,
			metodologia,
			result_disc,
			conclusao,
			status,
			categoria_id,
			estado_id,
		});
		const output = await projetoModel.list({ status });
		expect(output.data.every((projeto) => projeto.status === status)).toBeTruthy();
		await projetoModel.delete(String(projeto.id));
	});

	it("deve retornar apenas projetos com a mesma CATEGORIA_ID", async () => {
		const { nome, resumo, introducao, objetivo, metodologia, result_disc, conclusao, status, categoria_id, estado_id } =
			ProjetoFactory.create().withCategoria(defaultRandomCategoriaId).withEstado(defaultEstadoId).build();
		const projeto = await projetoModel.create({
			nome,
			resumo,
			introducao,
			objetivo,
			metodologia,
			result_disc,
			conclusao,
			status,
			categoria_id,
			estado_id,
		});
		const output = await projetoModel.list({ categoria_id: defaultRandomCategoriaId });
		expect(output.data.every((projeto) => projeto.categoria_id === defaultRandomCategoriaId)).toBeTruthy();
		await projetoModel.delete(String(projeto.id));
	});

	it("deve retornar apenas projetos com o mesmo ESTADO_ID", async () => {
		const { nome, resumo, introducao, objetivo, metodologia, result_disc, conclusao, status, categoria_id, estado_id } =
			ProjetoFactory.create().withCategoria(defaultCategoriaId).withEstado(defaultRandomEstadoId).build();
		const projeto = await projetoModel.create({
			nome,
			resumo,
			introducao,
			objetivo,
			metodologia,
			result_disc,
			conclusao,
			status,
			categoria_id,
			estado_id,
		});
		const output = await projetoModel.list({ estado_id: defaultRandomEstadoId });
		expect(output.data.every((projeto) => projeto.estado_id === defaultRandomEstadoId)).toBeTruthy();
		await projetoModel.delete(String(projeto.id));
	});

	it("deve retornar uma lista de projetos que contenham o NOME", async () => {
		const { nome, resumo, introducao, objetivo, metodologia, result_disc, conclusao, status, categoria_id, estado_id } =
			ProjetoFactory.create()
				.withNome("Teste")
				.withCategoria(defaultCategoriaId)
				.withEstado(defaultRandomEstadoId)
				.build();
		const projeto = await projetoModel.create({
			nome,
			resumo,
			introducao,
			objetivo,
			metodologia,
			result_disc,
			conclusao,
			status,
			categoria_id,
			estado_id,
		});
		const output = await projetoModel.list({ nome__ilike: "Teste" });
		expect(output.data.map((projeto) => projeto.nome)).toContain("Teste");
		await projetoModel.delete(String(projeto.id));
	});

	it("não deve ser CASE SENSTIVIE ao busca projetos que contenham o NOME", async () => {
		const { nome, resumo, introducao, objetivo, metodologia, result_disc, conclusao, status, categoria_id, estado_id } =
			ProjetoFactory.create()
				.withNome("Teste")
				.withCategoria(defaultCategoriaId)
				.withEstado(defaultRandomEstadoId)
				.build();
		const projeto = await projetoModel.create({
			nome,
			resumo,
			introducao,
			objetivo,
			metodologia,
			result_disc,
			conclusao,
			status,
			categoria_id,
			estado_id,
		});
		const output = await projetoModel.list({ nome__ilike: "teste" });
		expect(output.data.map((projeto) => projeto.nome)).toContain("Teste");
		await projetoModel.delete(String(projeto.id));
	});
});
