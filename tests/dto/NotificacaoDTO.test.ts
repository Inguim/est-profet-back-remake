import { describe, expect, it } from "vitest";
import { NotificacaoDTO, type INotificacaoDTO } from "../../src/dto/index.js";

describe("NotificacaoDTO", () => {
	it("deve conter as propriedades de INotificacaoDTO", () => {
		const output = new NotificacaoDTO({
			visto: false,
			user_id: "qwe",
			tipo: { id: "123", nome: "231" },
			solicitacao: {
				id: "123",
				titulo: "123",
				descricao: "132qsd",
				status: {
					value: "aguardando",
					label: "Aguardando",
				},
			},
		});
		expect(output).toHaveProperty("id");
		expect(output).toHaveProperty("visto");
		expect(output).toHaveProperty("user_id");
		expect(output).toHaveProperty("tipo");
		expect(output.tipo).toHaveProperty("id");
		expect(output.tipo).toHaveProperty("nome");
		expect(output.solicitacao).toHaveProperty("id");
		expect(output.solicitacao).toHaveProperty("titulo");
		expect(output.solicitacao).toHaveProperty("descricao");
		expect(output.solicitacao).toHaveProperty("status");
		expect(output.solicitacao.status).toHaveProperty("value");
		expect(output.solicitacao.status).toHaveProperty("label");
		expect(output).toHaveProperty("solicitacao");
		expect(output).toHaveProperty("created_at");
		expect(output).toHaveProperty("updated_at");
	});

	it("deve preencher automaticamente os campos não parciais", () => {
		const output = new NotificacaoDTO({
			visto: false,
			user_id: "qwe",
			tipo: { id: "123", nome: "231" },
			solicitacao: {
				id: "123",
				titulo: "123",
				descricao: "132qsd",
				status: {
					value: "aguardando",
					label: "Aguardando",
				},
			},
		});
		expect(output.id).toBeNull();
		expect(output.created_at).toBeUndefined();
		expect(output.updated_at).toBeUndefined();
	});

	it("deve preencher corretamente os campos", () => {
		const input: INotificacaoDTO = {
			id: "2123",
			visto: true,
			user_id: "qwe",
			tipo: { id: "123", nome: "231" },
			solicitacao: {
				id: "123",
				titulo: "123",
				descricao: "132qsd",
				status: {
					value: "aguardando",
					label: "Aguardando",
				},
			},
			created_at: new Date(),
			updated_at: new Date(),
		};
		const output = new NotificacaoDTO(input);
		expect(output).toEqual(input);
	});
});
