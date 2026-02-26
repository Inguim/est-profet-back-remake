import { describe, expect, it } from "vitest";
import {
	USUARIO_PROJETO_STATUS,
	USUARIO_PROJETO_STATUS_VALUES,
	UsuarioProjetoDTO,
	type IUsuarioProjetoDTO,
} from "../../src/dto/index.js";

describe("UsuarioProjetoDTO", () => {
	it("deve conter as propriedades de IUsuarioProjetoDTO", () => {
		const output = new UsuarioProjetoDTO({
			relacao: "coordenador",
			user_id: "a1",
			projeto_id: "a1",
		});
		expect(output).toHaveProperty("id");
		expect(output).toHaveProperty("relacao");
		expect(output).toHaveProperty("user_id");
		expect(output).toHaveProperty("projeto_id");
		expect(output).toHaveProperty("created_at");
		expect(output).toHaveProperty("updated_at");
	});

	it("deve preencher automaticamente os campos não parciais", () => {
		const output = new UsuarioProjetoDTO({
			relacao: "coordenador",
			user_id: "a1",
			projeto_id: "a1",
		});
		expect(output.id).toBeNull();
		expect(output.created_at).toBeUndefined();
		expect(output.updated_at).toBeUndefined();
	});

	it("deve preencher corretamente os campos", () => {
		const input: IUsuarioProjetoDTO = {
			id: "id123",
			relacao: "coordenador",
			user_id: "a1",
			projeto_id: "a1",
			created_at: new Date(),
			updated_at: new Date(),
		};
		const output = new UsuarioProjetoDTO(input);
		expect(output).toEqual(input);
	});

	it.each(USUARIO_PROJETO_STATUS_VALUES)("deve retornar o label correto para a relação: %s", async (relacao) => {
		const input = new UsuarioProjetoDTO({
			user_id: "a1",
			projeto_id: "a1",
			relacao,
		});
		const output = input.getRelacaoLabel();
		expect(output).toEqual(USUARIO_PROJETO_STATUS[relacao]);
	});
});
