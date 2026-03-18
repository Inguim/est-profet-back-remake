import { beforeAll, describe, expect, it } from "vitest";
import { ContribuidorDTO } from "../../src/dto/ContribuidorDTO.js";
import { ContribuidorModel, type TCreateModelContribuidorDTO } from "../../src/models/ContribuidorModel.js";
import { UsuarioModel } from "../../src/models/UsuarioModel.js";
import { UsuarioAlunoFactory } from "../factories/UsuarioAlunoFactory.js";
import { NotFoundError } from "../../src/errors/NotFoundError.js";
import { faker as f } from "@faker-js/faker";
import { TipoContribuicaoModel } from "../../src/models/TipoContribuicaoModel.js";
import { TIPOS_CONTRUIBUICAO } from "../../src/utils/constants/tipos-contribuicao.js";

describe("ContribuidorModel", () => {
	let defaultTipoId: string;
	let defaultUserId: string;

	const contribuidorModel = new ContribuidorModel();
	const tipoContribuicaoModel = new TipoContribuicaoModel();

	const prepararDadosTeste = async () => {
		const usuarioModel = new UsuarioModel();

		defaultTipoId = String((await tipoContribuicaoModel.get("idealizador_desenvolvedor")).id);

		const { nome, email, password, admin, status } = UsuarioAlunoFactory.create().withNome("teste").build();
		const usuario = await usuarioModel.create({ tipo: "aluno", nome, email, password, admin, status });
		defaultUserId = String(usuario?.id);
	};

	beforeAll(async () => {
		await prepararDadosTeste();
	});

	it("deve criar um contribuidor e retornar um ContribuidorDTO preenchida corretamente", async () => {
		const input = {
			tipo_contribuicao_id: defaultTipoId,
			user_id: defaultUserId,
			github_username: "teste",
		};
		const output = await contribuidorModel.create(input as TCreateModelContribuidorDTO);
		expect(output).instanceOf(ContribuidorDTO);
		expect(output.id).toBeDefined();
		expect(output.github_username).toEqual("teste");
		expect(output.tipo_contribuicao.id).toEqual(defaultTipoId);
		expect(output.tipo_contribuicao.nome).toEqual(TIPOS_CONTRUIBUICAO.idealizador_desenvolvedor);
		expect(output.usuario.id).toEqual(defaultUserId);
		expect(output.usuario.nome).toEqual("teste");
	});

	it("deve encontrar um contribuidor pelo ID", async () => {
		const input = await contribuidorModel.create({
			tipo_contribuicao_id: defaultTipoId,
			user_id: defaultUserId,
			github_username: "teste",
		});
		const output = await contribuidorModel.get(String(input.id));
		expect(output).instanceOf(ContribuidorDTO);
		expect(output.id).toEqual(String(input.id));
	});

	it("deve lançar um NotFoundError caso ID inexistente ao buscar por ID", async () => {
		const fakeId = f.string.uuid();
		await expect(contribuidorModel.get(fakeId)).rejects.toThrow(NotFoundError);
	});

	it("deve permitir atualizar os dados de um contribuidor", async () => {
		const tipoId = String((await tipoContribuicaoModel.get("desenvolvedor")).id);
		const input = await contribuidorModel.create({
			tipo_contribuicao_id: defaultTipoId,
			user_id: defaultUserId,
			github_username: "teste",
		});
		const output = await contribuidorModel.update(String(input.id), {
			github_username: "alterado",
			tipo_contribuicao_id: tipoId,
		});
		expect(output.github_username).toEqual("alterado");
		expect(output.tipo_contribuicao.id).toEqual(tipoId);
		expect(output.tipo_contribuicao.nome).toEqual(TIPOS_CONTRUIBUICAO.desenvolvedor);
	});

	it("deve lançar um NotFoundError caso ID inexistente ao atualizar por ID", async () => {
		const fakeId = f.string.uuid();
		await expect(contribuidorModel.update(fakeId, { github_username: "a", tipo_contribuicao_id: "a" })).rejects.toThrow(
			NotFoundError,
		);
	});

	it("deve permitir excluir um contribuidor pelo ID", async () => {
		const input = await contribuidorModel.create({
			tipo_contribuicao_id: defaultTipoId,
			user_id: defaultUserId,
			github_username: "teste",
		});
		const output = await contribuidorModel.delete(String(input.id));
		expect(output).instanceOf(ContribuidorDTO);
		expect(output.id).toBeNull();
	});

	it("deve lançar um NotFoundError caso ID inexistente ao excluir por ID", async () => {
		const fakeId = f.string.uuid();
		await expect(contribuidorModel.delete(fakeId)).rejects.toThrow(NotFoundError);
	});

	it("deve retornar uma lista paginada", async () => {
		await contribuidorModel.create({
			tipo_contribuicao_id: defaultTipoId,
			user_id: defaultUserId,
			github_username: "teste",
		});
		const output = await contribuidorModel.list();
		expect(output).toHaveProperty("data");
		expect(output).toHaveProperty("page");
		expect(output).toHaveProperty("perPage");
		expect(output).toHaveProperty("count");
		expect(output).toHaveProperty("totalPages");
	});
});
