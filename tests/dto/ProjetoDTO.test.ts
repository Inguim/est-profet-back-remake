import { describe, expect, it } from "vitest";
import { ProjetoDTO, type IProjetoDTO } from "../../src/dto/index.js";

describe("ProjetoDTO", () => {
	it("deve conter as propriedades de IProjetoDTO", () => {
		const output = new ProjetoDTO({
			nome: "a",
			resumo: "a",
			introducao: "a",
			objetivo: "a",
			metodologia: "a",
			result_disc: "a",
			conclusao: "a",
			categoria_id: "123",
			estado_id: "123",
		});
		expect(output).toHaveProperty("id");
		expect(output).toHaveProperty("nome");
		expect(output).toHaveProperty("resumo");
		expect(output).toHaveProperty("introducao");
		expect(output).toHaveProperty("objetivo");
		expect(output).toHaveProperty("metodologia");
		expect(output).toHaveProperty("result_disc");
		expect(output).toHaveProperty("conclusao");
		expect(output).toHaveProperty("categoria_id");
		expect(output).toHaveProperty("estado_id");
		expect(output).toHaveProperty("created_at");
		expect(output).toHaveProperty("updated_at");
	});

	it("deve preencher automaticamente os campos não parciais", () => {
		const output = new ProjetoDTO({
			nome: "a",
			resumo: "a",
			introducao: "a",
			objetivo: "a",
			metodologia: "a",
			result_disc: "a",
			conclusao: "a",
			categoria_id: "123",
			estado_id: "123",
		});
		expect(output.id).toBeNull();
		expect(output.status).toEqual("analise");
		expect(output.created_at).toBeUndefined();
		expect(output.updated_at).toBeUndefined();
	});

	it("deve preencher corretamente os campos", () => {
		const input: IProjetoDTO = {
			id: "id123",
			nome: "a",
			resumo: "a",
			introducao: "a",
			objetivo: "a",
			metodologia: "a",
			result_disc: "a",
			conclusao: "a",
			categoria_id: "123",
			status: "alteracao",
			estado_id: "123",
			created_at: new Date(),
			updated_at: new Date(),
		};
		const output = new ProjetoDTO(input);
		expect(output).toEqual(input);
	});
});
