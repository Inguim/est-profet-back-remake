import { describe, expect, it } from "vitest";
import { ContribuidorDTO, type IContribuidorDTO } from "../../src/dto/ContribuidorDTO.js";

describe("ContribuidorDTO", () => {
	it("deve conter as propriedades de IContribuidorDTO", () => {
		const output = new ContribuidorDTO({
			github_username: "teste",
			tipo_contribuicao: {
				id: "asd",
				nome: "as",
			},
			usuario: {
				id: "asd",
				nome: "asd",
			},
		});
		expect(output).toHaveProperty("id");
		expect(output).toHaveProperty("github_username");
		expect(output).toHaveProperty("tipo_contribuicao");
		expect(output.tipo_contribuicao).toHaveProperty("id");
		expect(output.tipo_contribuicao).toHaveProperty("nome");
		expect(output.usuario).toHaveProperty("id");
		expect(output.usuario).toHaveProperty("nome");
		expect(output).toHaveProperty("usuario");
		expect(output).toHaveProperty("created_at");
		expect(output).toHaveProperty("updated_at");
	});

	it("deve preencher automaticamente os campos não parciais", () => {
		const output = new ContribuidorDTO({
			github_username: "teste",
			tipo_contribuicao: {
				id: "asd",
				nome: "as",
			},
			usuario: {
				id: "asd",
				nome: "asd",
			},
		});
		expect(output.id).toBeNull();
		expect(output.github_dados).toBeNull();
		expect(output.created_at).toBeUndefined();
		expect(output.updated_at).toBeUndefined();
	});

	it("deve preencher corretamente os campos", () => {
		const input: IContribuidorDTO = {
			id: "123123",
			github_username: "teste",
			tipo_contribuicao: {
				id: "asd",
				nome: "as",
			},
			usuario: {
				id: "asd",
				nome: "asd",
			},
			github_dados: {
				bio: "asd",
				cover_url: "asdda",
				git: "asd",
				username: "asd",
			},
			created_at: new Date(),
			updated_at: new Date(),
		};
		const output = new ContribuidorDTO(input);
		expect(output).toEqual(input);
	});
});
