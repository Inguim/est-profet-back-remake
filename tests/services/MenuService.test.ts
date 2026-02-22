import { describe, expect, it } from "vitest";
import { MenuDTO } from "../../src/dto/index.js";
import { MenuService, CategoriaService } from "../../src/services/index.js";

describe("MenuService", () => {
	const categoriaService = new CategoriaService();
	const service = new MenuService({ categoriaService });

	it("deve retornar uma lista de menus", async () => {
		const output = await service.list();
		expect(output).toBeInstanceOf(Array);
		expect(output.at(0)).toBeInstanceOf(MenuDTO);
	});

	it("deve retornar menus com categorias", async () => {
		const output = await service.list();
		expect(output).toBeInstanceOf(Array);
		expect(output.at(0)?.categorias).toBeDefined();
	});

	it("as categorias devem pertencer ao menu correto", async () => {
		const output = await service.list();
		const menuComCategorias = output.filter((menu) => Number(menu.categorias?.length) > 0);
		for (const { id, categorias } of menuComCategorias) {
			expect(categorias?.every(({ menu_id }) => menu_id == id)).toBeTruthy();
		}
	});
});
