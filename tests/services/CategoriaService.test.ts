import { beforeAll, describe, expect, it } from "vitest";
import { CategoriaDTO } from "../../src/dto/index.js";
import { CategoriaService } from "../../src/services/index.js";

describe("CategoriaService", () => {
	let categoria: CategoriaDTO;
	const service = new CategoriaService();

	beforeAll(async () => {
		categoria = (await service.list()).at(0) as CategoriaDTO;
	});

	it("deve retornar uma lista de categorias", async () => {
		const output = await service.list();
		expect(output).toBeInstanceOf(Array);
		expect(output.at(0)).toBeInstanceOf(CategoriaDTO);
	});

	it("deve permitir filtrar por ID", async () => {
		const input = String(categoria?.id);
		const output = await service.list();
		const outputFiltred = await service.list({ id: [input] });
		expect(output.length).not.toEqual(outputFiltred.length);
	});

	it("deve permitir filtrar por NOME", async () => {
		const input = String(categoria?.nome);
		const output = await service.list();
		const outputFiltred = await service.list({ nome__ilike: input });
		expect(output.length).not.toEqual(outputFiltred.length);
	});

	it("deve permitir filtrar por DESCRICAO", async () => {
		const input = String(categoria?.descricao);
		const output = await service.list();
		const outputFiltred = await service.list({ descricao__ilike: input });
		expect(output.length).not.toEqual(outputFiltred.length);
	});

	it("deve permitir filtrar por SLUG", async () => {
		const input = String(categoria?.slug);
		const output = await service.list();
		const outputFiltred = await service.list({ slug: input });
		expect(output.length).not.toEqual(outputFiltred.length);
	});

	it("deve permitir filtrar por MENU_ID", async () => {
		const input = String(categoria?.menu_id);
		const output = await service.list({ menu_id: input });
		expect(output.map((categoria) => categoria.menu_id)).toContain(input);
	});
});
