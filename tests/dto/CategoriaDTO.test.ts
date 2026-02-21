import { describe, expect, it } from "vitest";
import { CategoriaDTO, type ICategoriaDTO } from "../../src/dto/index.js";

describe("CategoriaDTO", () => {
	it("deve conter as propriedades de ICategoriaDTO", () => {
		const output = new CategoriaDTO({
			nome: "Categoria teste",
			slug: "categoria-teste",
			descricao: "teste",
			menu_id: "a1232",
		});
		expect(output).toHaveProperty("id");
		expect(output).toHaveProperty("nome");
		expect(output).toHaveProperty("slug");
		expect(output).toHaveProperty("descricao");
		expect(output).toHaveProperty("created_at");
		expect(output).toHaveProperty("updated_at");
	});

	it("deve preencher automaticamente os campos não parciais", () => {
		const output = new CategoriaDTO({
			nome: "Categoria teste 2",
			slug: "categoria-teste-2",
			descricao: "teste",
			menu_id: "a1232",
		});
		expect(output.id).toBeNull();
		expect(output.created_at).toBeUndefined();
		expect(output.updated_at).toBeUndefined();
	});

	it("deve preencher corretamente os campos", () => {
		const input: ICategoriaDTO = {
			id: "123123",
			nome: "Categoria teste",
			slug: "categoria-teste",
			descricao: "teste",
			menu_id: "a1232",
			created_at: new Date(),
			updated_at: new Date(),
		};
		const output = new CategoriaDTO(input);
		expect(output).toEqual(input);
	});
});
