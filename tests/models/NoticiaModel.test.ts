import { beforeAll, describe, expect, it } from "vitest";
import { UsuarioModel } from "../../src/models/UsuarioModel.js";
import { UsuarioProfessorFactory } from "../factories/UsuarioProfessorFactory.js";
import { NoticiaModel } from "../../src/models/NoticiaModel.js";
import { NoticiaDTO } from "../../src/dto/NoticiaDTO.js";

describe("NoticiaModel", () => {
	let defaultUsuarioId: string;

	const usuarioModel = new UsuarioModel();
	const noticiaModel = new NoticiaModel();

	const prepararDadosTeste = async () => {
		const { nome, email, tipo, admin, status, password } = UsuarioProfessorFactory.create().build();
		const usuario = await usuarioModel.create({ nome, email, tipo, admin, status, password });
		defaultUsuarioId = String(usuario.id);
	};

	beforeAll(async () => {
		await prepararDadosTeste();
	});

	it("deve criar um noticia com os dados corretos", async () => {
		const input = { nome: "teste", link: "teste", user_id: defaultUsuarioId };
		const output = await noticiaModel.create(input);
		expect(output.id).toBeDefined();
		expect(output.nome).toEqual(input.nome);
		expect(output.link).toEqual(input.link);
		expect(output.user_id).toEqual(input.user_id);
	});

	it("deve popular o modelo com dados da noticia", async () => {
		const input = await noticiaModel.create({ nome: "teste", link: "teste", user_id: defaultUsuarioId });
		const output = await noticiaModel.populate(String(input.id));
		expect(output.id).toBeDefined();
		expect(output.nome).toEqual(input.nome);
		expect(output.link).toEqual(input.link);
		expect(output.user_id).toEqual(input.user_id);
	});

	it("deve atualizar os dados de uma noticia", async () => {
		const { nome, email, tipo, admin, status, password } = UsuarioProfessorFactory.create().build();
		const usuario = await usuarioModel.create({ nome, email, tipo, admin, status, password });
		const input = await noticiaModel.create({ nome: "teste", link: "teste", user_id: defaultUsuarioId });
		const output = await noticiaModel.update(String(input.id), {
			nome: "atualizado",
			link: "atualizado",
			user_id: String(usuario.id),
		});
		expect(output.nome).not.toEqual(input.nome);
		expect(output.link).not.toEqual(input.link);
		expect(output.user_id).not.toEqual(input.user_id);
	});

	it("deve retornar uma lista paginada", async () => {
		const output = await noticiaModel.list();
		expect(output).toHaveProperty("data");
		expect(output).toHaveProperty("page");
		expect(output).toHaveProperty("perPage");
		expect(output).toHaveProperty("count");
		expect(output).toHaveProperty("totalPages");
	});

	it("deve retornar uma lista de NoticiaDTO", async () => {
		const output = await noticiaModel.list();
		expect(output.data).instanceOf(Array);
		expect(output.data.every((noticia) => noticia instanceof NoticiaDTO)).toBeTruthy();
	});

	it("deve retornar apenas noticias com o USER_ID", async () => {
		const output = await noticiaModel.list({ user_id: defaultUsuarioId });
		expect(output.data).instanceOf(Array);
		expect(output.data.every((noticia) => noticia.user_id === defaultUsuarioId)).toBeTruthy();
	});

	it("deve deletar uma noticia", async () => {
		const input = await noticiaModel.create({ nome: "teste", link: "teste", user_id: defaultUsuarioId });
		const output = await noticiaModel.delete(String(input.id));
		expect(output.id).toBeNull();
	});
});
