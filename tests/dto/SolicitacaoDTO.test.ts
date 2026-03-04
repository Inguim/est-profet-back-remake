import { describe, expect, it } from "vitest";
import {
	SOLICITACAO_STATUS,
	SOLICITACAO_STATUS_VALUES,
	SolicitacaoDTO,
	type ISolicitacaoDTO,
} from "../../src/dto/index.js";

describe("SolicitacaoDTO", () => {
	it("deve conter as propriedades de ISolicitacaoDTO", () => {
		const output = new SolicitacaoDTO({
			titulo: "a",
			descricao: "a",
			projeto_id: "ada",
			creator_id: "a",
			deleted_id: "a",
		});
		expect(output).toHaveProperty("id");
		expect(output).toHaveProperty("titulo");
		expect(output).toHaveProperty("descricao");
		expect(output).toHaveProperty("projeto_id");
		expect(output).toHaveProperty("creator_id");
		expect(output).toHaveProperty("deleted_id");
		expect(output).toHaveProperty("projeto");
		expect(output).toHaveProperty("created_at");
		expect(output).toHaveProperty("updated_at");
	});

	it("deve preencher automaticamente os campos não parciais", () => {
		const output = new SolicitacaoDTO({
			titulo: "a",
			descricao: "a",
			projeto_id: "ada",
			creator_id: "a",
			deleted_id: "a",
		});
		expect(output.id).toBeNull();
		expect(output.status).toEqual("aguardando");
		expect(output.created_at).toBeUndefined();
		expect(output.updated_at).toBeUndefined();
	});

	it("deve preencher corretamente os campos", () => {
		const input: ISolicitacaoDTO = {
			id: "id123",
			titulo: "a",
			descricao: "a",
			projeto_id: "ada",
			creator_id: "a",
			deleted_id: "a",
			status: "aprovado",
			projeto: {
				id: "as",
				nome: "asdd",
			},
			created_at: new Date(),
			updated_at: new Date(),
		};
		const output = new SolicitacaoDTO(input);
		expect(output).toEqual(input);
	});

	it.each(SOLICITACAO_STATUS_VALUES)("deve retornar o label correto para o status: %s", async (status) => {
		const input = new SolicitacaoDTO({
			titulo: "a",
			descricao: "a",
			projeto_id: "ada",
			creator_id: "a",
			deleted_id: "a",
			status,
		});
		const output = input.getStatusLabel();
		expect(output).toEqual(SOLICITACAO_STATUS[status]);
	});
});
