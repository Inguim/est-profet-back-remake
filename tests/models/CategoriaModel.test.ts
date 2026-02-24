import { beforeAll, describe, expect, it } from "vitest";
import { CategoriaModel } from "../../src/models/index.js";
import { CategoriaDTO } from "../../src/dto/index.js";

describe("CategoriaModel", () => {
	let defaultCategorias: CategoriaDTO[];
	let defaultCategoriasCount: number;
	const model = new CategoriaModel();

	beforeAll(async () => {
		defaultCategorias = await model.list();
		defaultCategoriasCount = defaultCategorias.length;
	});

	it("deve retornar uma lista de categorias", async () => {
		const output = await model.list();
		expect(output).toBeInstanceOf(Array);
		expect(output.at(0)).toBeInstanceOf(CategoriaDTO);
	});

	it("deve retornar valores com o mesmo valor de ID", async () => {
		const input = defaultCategorias.at(0)?.id;
		const output = await model.list({ id: [String(input)] });
		expect(output.length).toEqual(1);
		expect(output.map((categoria) => categoria.id)).toContain(input);
	});

	it("deve retornar valores que contenham o NOME", async () => {
		const input = "Multidisci";
		const output = await model.list({ nome__ilike: input });
		expect(output.length).toBeLessThan(defaultCategoriasCount);
		expect(output.map((categoria) => categoria.nome)).toContain("Multidisciplinar");
	});

	it("não deve ser CASE SENSITIVE ao buscar por NOME", async () => {
		const input = "multidisciplinar";
		const output = await model.list({ nome__ilike: input });
		expect(output.length).toBeLessThan(defaultCategoriasCount);
		expect(output.map((categoria) => categoria.nome)).toContain("Multidisciplinar");
	});

	it("deve retornar valores que contenham a DESCRICAO", async () => {
		const input = "englobam mais de uma";
		const output = await model.list({ descricao__ilike: input });
		expect(output.length).toBeLessThan(defaultCategoriasCount);
		expect(output.some((categoria) => categoria.descricao.includes("englobam mais de uma"))).toBeTruthy();
	});

	it("não deve ser CASE SENSITIVE ao buscar por DESCRICAO", async () => {
		const input = "Englobam Mais de uma";
		const output = await model.list({ descricao__ilike: input });
		expect(output.length).toBeLessThan(defaultCategoriasCount);
		expect(output.some((categoria) => categoria.descricao.includes("englobam mais de uma"))).toBeTruthy();
	});

	it("deve retornar valores com o mesmo valor de SLUG", async () => {
		const input = defaultCategorias.at(0)?.slug;
		const output = await model.list({ slug: String(input) });
		expect(output.length).toBeLessThan(defaultCategoriasCount);
		expect(output.map((categoria) => categoria.slug)).toContain(input);
	});

	it("deve retornar valores com o mesmo valor de MENU_ID", async () => {
		const input = defaultCategorias.at(0)?.menu_id;
		const output = await model.list({ menu_id: String(input) });
		expect(output.map((categoria) => categoria.menu_id)).toContain(input);
	});
});
