import { describe, expect, it } from "vitest";
import { UsuarioModel } from "../../src/models/index.js";
import { faker as f } from "@faker-js/faker";
import { UsuarioAlunoFactory, UsuarioProfessorFactory } from "../factories/index.js";

describe("UsuarioModel", () => {
	it("deve criar uma instância do modelo Usuario", () => {
		const input = new UsuarioModel();
		expect(input).toBeInstanceOf(UsuarioModel);
	});

	it("deve criar um usuário e preencher o campo ID com um UUID", async () => {
		const { nome, email, tipo, admin, status, password } = UsuarioAlunoFactory.create().build();
		const input = { nome, email, tipo, admin, status, password };
		const model = new UsuarioModel();
		const output = await model.create(input);
		expect(output.id).toBeDefined();
		expect(output.id).toBeTypeOf("string");
	});

	it("deve hashear a senha antes de criar o usuário", async () => {
		const { nome, email, tipo, admin, status, password } = UsuarioAlunoFactory.create().build();
		const input = { nome, email, tipo, admin, status, password };
		const model = new UsuarioModel();
		const output = await model.create(input);
		expect(output.password).not.toEqual(input.password);
	});

	it("deve criar um usuário com os dados corretos", async () => {
		const { nome, email, tipo, admin, status, password, created_at, updated_at } = UsuarioProfessorFactory.create()
			.withStatus("aprovado")
			.asAdmin()
			.build();
		const input = { nome, email, tipo, admin, status, password, created_at, updated_at };
		const model = new UsuarioModel();
		const output = await model.create(input);
		expect(output.nome).toEqual(input.nome);
		expect(output.email).toEqual(input.email);
		expect(output.admin).toEqual(input.admin);
		expect(output.status).toEqual(input.status);
		expect(output.tipo).toEqual(input.tipo);
		expect(output.created_at).toEqual(input.created_at);
		expect(output.updated_at).toEqual(input.updated_at);
	});

	it("deve popular o modelo com os dados do usuário existente", async () => {
		const { nome, email, tipo, admin, status, password } = UsuarioAlunoFactory.create().build();
		const input = { nome, email, tipo, admin, status, password };
		const model = new UsuarioModel();
		const output = await model.create(input);
		const outputPopulated = await model.populate(output.id as string);
		expect(outputPopulated.id).not.toBeNull();
		expect(outputPopulated.id).toEqual(output.id);
		expect(outputPopulated.nome).toEqual(output.nome);
		expect(outputPopulated.password).toEqual(output.password);
	});

	it("deve atualizar os dados do usuário", async () => {
		const { nome, email, tipo, admin, status, password, updated_at } = UsuarioProfessorFactory.create()
			.asAdmin()
			.withStatus("aprovado")
			.build();
		const input = { nome, email, tipo, admin, status, password, updated_at };
		const model = new UsuarioModel();
		const { id } = await model.create(input);
		const output = await model.update(id as string, {
			nome: "nome atualizado",
			email: "email@atualizado.com",
			tipo: "aluno",
			status: "analise",
			admin: false,
		});
		expect(input.nome).not.toEqual(output.nome);
		expect(input.email).not.toEqual(output.email);
		expect(input.tipo).not.toEqual(output.tipo);
		expect(input.status).not.toEqual(output.status);
		expect(input.admin).not.toEqual(output.admin);
		expect(input.updated_at).not.toEqual(output.updated_at);
	});

	it("deve atualizar a senha do usuário", async () => {
		const { nome, email, tipo, admin, status, password } = UsuarioAlunoFactory.create().build();
		const input = { nome, email, tipo, admin, status, password };
		const model = new UsuarioModel();
		const { id, password: oldPassword } = await model.create(input);
		const inputNewPassword = f.internet.password();
		const outputUpdated = await model.update(id as string, { password: inputNewPassword });
		expect(outputUpdated.id).toEqual(id);
		expect(outputUpdated.password).not.toEqual(oldPassword);
	});

	it("deve deletar um usuário", async () => {
		const { nome, email, tipo, admin, status, password } = UsuarioAlunoFactory.create().build();
		const input = { nome, email, tipo, admin, status, password };
		const model = new UsuarioModel();
		const { id } = await model.create(input);
		const output = await model.delete(id as string);
		expect(output.id).toBeNull();
	});
});
