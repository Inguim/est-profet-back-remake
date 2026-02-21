import { describe, expect, it } from "vitest";
import { MenuDTO, type IMenuDTO } from "../../src/dto/index.js";

describe("MenuDTO", () => {
	it("deve conter as propriedades de IMenuDTO", () => {
		const output = new MenuDTO({
			nome: "Menu teste",
			url: "/",
			categorias: [],
		});
		expect(output).toHaveProperty("id");
		expect(output).toHaveProperty("nome");
		expect(output).toHaveProperty("url");
		expect(output).toHaveProperty("categorias");
		expect(output).toHaveProperty("created_at");
		expect(output).toHaveProperty("updated_at");
	});

	it("deve preencher automaticamente os campos não parciais", () => {
		const output = new MenuDTO({
			nome: "Menu teste 2",
			url: "/",
		});
		expect(output.id).toBeNull();
		expect(output.created_at).toBeUndefined();
		expect(output.updated_at).toBeUndefined();
		expect(output.categorias).toBeUndefined();
	});

	it("deve preencher corretamente os campos", () => {
		const input: IMenuDTO = {
			id: "123123",
			nome: "Categoria teste",
			url: "/",
			created_at: new Date(),
			updated_at: new Date(),
			categorias: [
				{
					id: "12321",
					nome: "Categoria teste",
					slug: "categoria-teste",
					descricao: "teste",
					menu_id: "2312",
				},
			],
		};
		const output = new MenuDTO(input);
		expect(output).toEqual(input);
	});
});
