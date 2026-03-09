import { describe, expect, it } from "vitest";
import { TipoNotificacaoDTO, type ITipoNotificacaoDTO } from "../../src/dto/TipoNotificacaoDTO.js";

describe("ITipoNotificacaoDTO", () => {
	it("deve conter as propriedades de ITipoNotificacaoDTO", () => {
		const output = new TipoNotificacaoDTO({
			nome: "teste",
		});
		expect(output).toHaveProperty("id");
		expect(output).toHaveProperty("nome");
		expect(output).toHaveProperty("created_at");
		expect(output).toHaveProperty("updated_at");
	});

	it("deve preencher automaticamente os campos não parciais", () => {
		const output = new TipoNotificacaoDTO({
			nome: "teste",
		});
		expect(output.id).toBeNull();
		expect(output.created_at).toBeUndefined();
		expect(output.updated_at).toBeUndefined();
	});

	it("deve preencher corretamente os campos", () => {
		const input: ITipoNotificacaoDTO = {
			id: "123123",
			nome: "Categoria teste",
			created_at: new Date(),
			updated_at: new Date(),
		};
		const output = new TipoNotificacaoDTO(input);
		expect(output).toEqual(input);
	});
});
