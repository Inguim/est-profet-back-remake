import { describe, expect, it } from "vitest";
import { UsuarioModel } from "../../src/models/index.js";
import { faker as f } from "@faker-js/faker";
import { UsuarioAlunoFactory, UsuarioProfessorFactory } from "../factories/index.js";
import { USUARIO_STATUS, USUARIO_TIPOS, UsuarioDTO } from "../../src/dto/UsuarioDTO.js";

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
		const { nome, email, tipo, admin, status, password, created_at, updated_at } =
			UsuarioProfessorFactory.create().build();
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
			.build();
		const input = { nome, email, tipo, admin, status, password, updated_at };
		const model = new UsuarioModel();
		const { id } = await model.create(input);
		const output = await model.update(id as string, {
			nome: "nome atualizado",
			email: "email@atualizado.com",
			status: "aprovado",
			admin: false,
		});
		expect(input.nome).not.toEqual(output.nome);
		expect(input.email).not.toEqual(output.email);
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

	it("deve retornar uma lista paginada", async () => {
		const { nome, email, tipo, admin, status, password, updated_at } = UsuarioProfessorFactory.create()
			.asAdmin()
			.build();
		const input = { nome, email, tipo, admin, status, password, updated_at };
		const model = new UsuarioModel();
		await model.create(input);
		const output = await model.list();
		expect(output).toHaveProperty("data");
		expect(output).toHaveProperty("page");
		expect(output).toHaveProperty("perPage");
		expect(output).toHaveProperty("count");
		expect(output).toHaveProperty("totalPages");
	});

	it("deve retornar uma lista de UsuarioDTO", async () => {
		const { nome, email, tipo, admin, status, password, updated_at } = UsuarioProfessorFactory.create()
			.asAdmin()
			.build();
		const input = { nome, email, tipo, admin, status, password, updated_at };
		const model = new UsuarioModel();
		await model.create(input);
		const output = await model.list();
		expect(output.data).instanceOf(Array);
		expect(output.data.every((usuario) => usuario instanceof UsuarioDTO)).toBeTruthy();
	});

	it("deve retornar uma lista de usuarios que contenham o NOME", async () => {
		const { nome, email, tipo, admin, status, password } = UsuarioAlunoFactory.create().withNome("Teste").build();
		const input = { nome, email, tipo, admin, status, password };
		const model = new UsuarioModel();
		await model.create(input);
		const output = await model.list({ nome__ilike: "Teste" });
		expect(output.data.map((usuario) => usuario.nome)).toContain("Teste");
	});

	it("não deve ser CASE SENSTIVIE ao busca usuarios que contenham o NOME", async () => {
		const { nome, email, tipo, admin, status, password } = UsuarioAlunoFactory.create().withNome("Teste").build();
		const input = { nome, email, tipo, admin, status, password };
		const model = new UsuarioModel();
		await model.create(input);
		const output = await model.list({ nome__ilike: "teste" });
		expect(output.data.map((usuario) => usuario.nome)).toContain("Teste");
	});

	it.each(USUARIO_STATUS)("deve retornar apenas usuarios com o STATUS: %s", async (status) => {
		const { nome, email, tipo, admin, password } = UsuarioProfessorFactory.create().withStatus(status).build();
		const input = { nome, email, tipo, admin, status, password };
		const model = new UsuarioModel();
		await model.create(input);
		const output = await model.list({ status });
		expect(output.data.every((usuario) => usuario.status === status)).toBeTruthy();
	});

	it.each(USUARIO_TIPOS)("deve retornar apenas usuarios com o TIPO: %s", async (tipo) => {
		const factory = tipo === "aluno" ? UsuarioAlunoFactory : UsuarioProfessorFactory;
		const { nome, email, admin, password, status } = factory.create().build();
		const input = { nome, email, tipo, admin, password, status };
		const model = new UsuarioModel();
		await model.create(input);
		const output = await model.list({ tipo });
		expect(output.data.every((usuario) => usuario.tipo === tipo)).toBeTruthy();
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
