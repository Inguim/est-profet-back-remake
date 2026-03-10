import { beforeAll, describe, expect, it } from "vitest";
import { NotificacaoDTO } from "../../src/dto/NotificacaoDTO.js";
import { NotificacaoModel, type TCreateModelNotificacaoDTO } from "../../src/models/NotificacaoModel.js";
import { TipoNotificacaoModel } from "../../src/models/TipoNotificacaoModel.js";
import { ProjetoModel } from "../../src/models/ProjetoModel.js";
import { UsuarioModel } from "../../src/models/UsuarioModel.js";
import { UsuarioAlunoFactory } from "../factories/UsuarioAlunoFactory.js";
import { ProjetoFactory } from "../factories/ProjetoFactory.js";
import { CategoriaModel } from "../../src/models/CategoriaModel.js";
import { EstadoModel } from "../../src/models/EstadoModel.js";
import type { EstadoDTO } from "../../src/dto/EstadoDTO.js";
import type { CategoriaDTO } from "../../src/dto/CategoriaDTO.js";
import { SolicitacaoModel } from "../../src/models/SolicitacaoModel.js";
import { NotFoundError } from "../../src/errors/NotFoundError.js";
import { faker as f } from "@faker-js/faker";

describe("NotificacaoModel", () => {
	let defaultTipoId: string;
	let defaultProjetoId: string;
	let defaultUserId: string;
	let defaultSolicitacaoId: string;

	const notificaoModel = new NotificacaoModel();

	const prepararDadosTeste = async () => {
		const tipoNotificacaoModel = new TipoNotificacaoModel();
		const projetoModel = new ProjetoModel();
		const usuarioModel = new UsuarioModel();
		const categoriasModel = new CategoriaModel();
		const estadoModel = new EstadoModel();
		const solicitacaoModel = new SolicitacaoModel();

		defaultTipoId = String((await tipoNotificacaoModel.get("solicitacao")).id);

		const { nome, email, password, admin, status } = UsuarioAlunoFactory.create().build();
		const usuario = await usuarioModel.create({ tipo: "aluno", nome, email, password, admin, status });
		defaultUserId = String(usuario?.id);

		const [primeiraCategoria] = await categoriasModel.list();
		const [primeiroEstado] = await estadoModel.list();
		const categoriaId = String((primeiraCategoria as CategoriaDTO).id);
		const estadoId = String((primeiroEstado as EstadoDTO).id);
		const {
			nome: nomeProjeto,
			resumo,
			introducao,
			objetivo,
			metodologia,
			result_disc,
			conclusao,
			status: statusProjeto,
			categoria_id,
			estado_id,
		} = ProjetoFactory.create().withCategoria(categoriaId).withEstado(estadoId).build();
		const projeto = await projetoModel.create({
			nome: nomeProjeto,
			resumo,
			introducao,
			objetivo,
			metodologia,
			result_disc,
			conclusao,
			status: statusProjeto,
			categoria_id,
			estado_id,
		});
		defaultProjetoId = String(projeto?.id);

		const solicitacao = await solicitacaoModel.create({
			titulo: "teste",
			descricao: "teste",
			projeto_id: defaultProjetoId,
			creator_id: defaultUserId,
			status: "aguardando",
		});
		defaultSolicitacaoId = String(solicitacao.id);
	};

	beforeAll(async () => {
		await prepararDadosTeste();
	});

	it("deve criar uma notificação e retornar um NotificacaoDTO preenchida corretamente", async () => {
		const input = {
			tipo_id: defaultTipoId,
			solicitacao_id: defaultSolicitacaoId,
			user_id: defaultUserId,
		};
		const output = await notificaoModel.create(input as TCreateModelNotificacaoDTO);
		expect(output).instanceOf(NotificacaoDTO);
		expect(output.id).toBeDefined();
		expect(output.user_id).toEqual(defaultUserId);
		expect(output.solicitacao.id).toEqual(defaultSolicitacaoId);
		expect(output.tipo_id).toEqual(defaultTipoId);
	});

	it("deve encontrar uma notificação pelo ID", async () => {
		const input = await notificaoModel.create({
			tipo_id: defaultTipoId,
			solicitacao_id: defaultSolicitacaoId,
			user_id: defaultUserId,
		});
		const output = await notificaoModel.get(String(input.id));
		expect(output).instanceOf(NotificacaoDTO);
		expect(output.id).toEqual(String(input.id));
	});

	it("deve lançar um NotFoundError caso ID inexistente ao buscar por ID", async () => {
		const fakeId = f.string.uuid();
		await expect(notificaoModel.get(fakeId)).rejects.toThrow(NotFoundError);
	});

	it("deve permitir atualizar dados de uma notificação", async () => {
		const input = await notificaoModel.create({
			tipo_id: defaultTipoId,
			solicitacao_id: defaultSolicitacaoId,
			user_id: defaultUserId,
		});
		const output = await notificaoModel.update(String(input.id), { visto: true });
		expect(output).instanceOf(NotificacaoDTO);
		expect(output).not.toStrictEqual(input);
	});

	it("deve lançar um NotFoundError caso ID inexistente ao atualizar dados", async () => {
		const fakeId = f.string.uuid();
		await expect(notificaoModel.update(fakeId, { visto: true })).rejects.toThrow(NotFoundError);
	});

	it("deve retornar uma lista paginada", async () => {
		await notificaoModel.create({
			tipo_id: defaultTipoId,
			solicitacao_id: defaultSolicitacaoId,
			user_id: defaultUserId,
		});
		const output = await notificaoModel.list();
		expect(output).toHaveProperty("data");
		expect(output).toHaveProperty("page");
		expect(output).toHaveProperty("perPage");
		expect(output).toHaveProperty("count");
		expect(output).toHaveProperty("totalPages");
	});

	it("deve retornar uma lista paginada", async () => {
		await notificaoModel.create({
			tipo_id: defaultTipoId,
			solicitacao_id: defaultSolicitacaoId,
			user_id: defaultUserId,
		});
		const output = await notificaoModel.list();
		expect(output.data).instanceOf(Array);
		expect(output.data.every((notificacao) => notificacao instanceof NotificacaoDTO)).toBeTruthy();
	});

	it("deve retornar apenas notificações com a mesma SOLICITACAO_ID", async () => {
		const solicitacaoModel = new SolicitacaoModel();
		const solicitacao = await solicitacaoModel.create({
			titulo: "teste",
			descricao: "teste",
			projeto_id: defaultProjetoId,
			creator_id: defaultUserId,
			status: "aguardando",
		});
		await notificaoModel.create({
			tipo_id: defaultTipoId,
			solicitacao_id: String(solicitacao.id),
			user_id: defaultUserId,
		});
		const output = await notificaoModel.list({ solicitacao_id: String(solicitacao.id) });
		expect(output.data).instanceOf(Array);
		expect(output.data.every((notificacao) => notificacao.solicitacao.id === String(solicitacao.id))).toBeTruthy();
	});

	it.each([true, false])("deve retornar apenas notificações com o VISTO: %s", async (visto) => {
		if (visto === true) {
			const input = await notificaoModel.create({
				tipo_id: defaultTipoId,
				solicitacao_id: defaultSolicitacaoId,
				user_id: defaultUserId,
			});
			await notificaoModel.update(String(input.id), { visto: true });
		}
		const output = await notificaoModel.list({ visto });
		expect(output.data).instanceOf(Array);
		expect(output.data.every((notificacao) => notificacao.visto === visto)).toBeTruthy();
	});
});
