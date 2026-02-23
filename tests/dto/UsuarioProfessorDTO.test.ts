import { describe, expect, it } from "vitest";
import { UsuarioProfessorDTO, type IUsuarioProfessorDTO } from "../../src/dto/index.js";

describe("UsuarioProfessorDTO", () => {
	it("deve conter as propriedades de IUsuarioProfessorDTO", () => {
		const output = new UsuarioProfessorDTO({
			nome: "ad",
			email: "e@mail.com",
			categorias: [],
			password: "asddas",
		});
		expect(output).toHaveProperty("id");
		expect(output).toHaveProperty("email");
		expect(output).toHaveProperty("tipo");
		expect(output).toHaveProperty("admin");
		expect(output).toHaveProperty("categorias");
		expect(output).toHaveProperty("created_at");
		expect(output).toHaveProperty("updated_at");
	});

	it("deve preencher automaticamente os campos não parciais", () => {
		const output = new UsuarioProfessorDTO({
			nome: "ad",
			email: "e@mail.com",
			categorias: [],
			password: "asddas",
		});
		expect(output.id).toBeNull();
		expect(output.created_at).toBeUndefined();
		expect(output.updated_at).toBeUndefined();
	});

	it("deve preencher corretamente os campos", () => {
		const input: IUsuarioProfessorDTO = {
			id: "asdq12323",
			nome: "ad",
			email: "e@mail.com",
			status: "analise",
			tipo: "professor",
			admin: false,
			password: "asddas",
			categorias: [
				{
					nome: "teste",
					slug: "teste",
					descricao: "teste",
					menu_id: "asdq12323",
				},
			],
			created_at: new Date(),
			updated_at: new Date(),
		};
		const output = new UsuarioProfessorDTO(input);
		expect(output).toEqual(input);
	});
});
