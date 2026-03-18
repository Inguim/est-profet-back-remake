import { describe, expect, it } from "vitest";
import { TipoContribuicaoDTO, type ITipoContribuicaoDTO } from "../../src/dto/index.js";

describe("TipoContribuicaoDTO", () => {
	it("deve conter as propriedades de ITipoContribuicaoDTO", () => {
		const output = new TipoContribuicaoDTO({ nome: "teste" });
		expect(output).toHaveProperty("id");
		expect(output).toHaveProperty("nome");
		expect(output).toHaveProperty("created_at");
		expect(output).toHaveProperty("updated_at");
	});

	it("deve preencher automaticamente os campos não parciais", () => {
		const output = new TipoContribuicaoDTO({ nome: "teste" });
		expect(output.id).toBeNull();
		expect(output.created_at).toBeUndefined();
		expect(output.updated_at).toBeUndefined();
	});

	it("deve preencher corretamente os campos", () => {
		const input: ITipoContribuicaoDTO = {
			id: "id123",
			nome: "teste",
			created_at: new Date(),
			updated_at: new Date(),
		};
		const output = new TipoContribuicaoDTO(input);
		expect(output).toEqual(input);
	});
});
