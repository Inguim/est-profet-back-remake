import { describe, expect, it } from "vitest";
import { USUARIO_STATUS, USUARIO_TIPOS, UsuarioDTO } from "./UsuarioDTO.js";
import { faker as f } from "@faker-js/faker";

describe("UsuarioDTO", () => {
	const TIPOS = [...USUARIO_TIPOS];
	const STATUS = [...USUARIO_STATUS];

	it("deve conter as propriedades de IUsuarioDTO", () => {
		const output = new UsuarioDTO();
		expect(output).toHaveProperty("nome");
		expect(output).toHaveProperty("email");
		expect(output).toHaveProperty("tipo");
		expect(output).toHaveProperty("status");
		expect(output).toHaveProperty("admin");
		expect(output).toHaveProperty("password");
	});

	it("deve preencher automaticamente os campos não parciais", () => {
		const output = new UsuarioDTO();
		expect(output.created_at).toBeInstanceOf(Date);
		expect(output.updated_at).toBeInstanceOf(Date);
		expect(output.tipo).toBe("aluno");
		expect(output.status).toBe("analise");
		expect(output.admin).toBe(false);
	});

	it("deve aceitar campos parciais no construtor", () => {
		const input = {
			nome: f.person.firstName(),
			email: f.internet.email(),
			tipo: f.helpers.arrayElement(TIPOS),
			status: f.helpers.arrayElement(STATUS),
			admin: f.datatype.boolean(),
			password: f.internet.password(),
		};

		const output = new UsuarioDTO(input);

		expect(output.nome).toBe(input.nome);
		expect(output.email).toBe(input.email);
		expect(output.tipo).toBe(input.tipo);
		expect(output.status).toBe(input.status);
		expect(output.admin).toBe(input.admin);
		expect(output.password).toBe(input.password);
	});
});
