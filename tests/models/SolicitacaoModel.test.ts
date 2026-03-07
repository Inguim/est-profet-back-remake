import { beforeAll, describe, expect, it } from "vitest";
import { CategoriaModel, EstadoModel, ProjetoModel, UsuarioModel } from "../../src/models/index.js";
import { ProjetoFactory, UsuarioProfessorFactory } from "../factories/index.js";
import type { CategoriaDTO } from "../../src/dto/CategoriaDTO.js";
import type { EstadoDTO } from "../../src/dto/EstadoDTO.js";
import { SolicitacaoModel } from "../../src/models/SolicitacaoModel.js";
import { SOLICITACAO_STATUS_VALUES, SolicitacaoDTO, type ISolicitacaoDTO } from "../../src/dto/SolicitacaoDTO.js";

describe("SolicitacaoModel", () => {
	let defaultUsuarioId: string;
	let defaultProjetoId: string;
	const solicitacaoModel = new SolicitacaoModel();

	const prepararDadosTeste = async () => {
		const usuarioModel = new UsuarioModel();
		const projetoModel = new ProjetoModel();
		const categoriaModel = new CategoriaModel();
		const estadoModel = new EstadoModel();
		const [primeiraCategoria] = await categoriaModel.list();
		const [primeiroEstado] = await estadoModel.list();
		const categoriaId = String((primeiraCategoria as CategoriaDTO).id);
		const estadoId = String((primeiroEstado as EstadoDTO).id);
		const { nome, email, tipo, admin, status, password } = UsuarioProfessorFactory.create().build();
		const usuario = await usuarioModel.create({ nome, email, tipo, admin, status, password });
		const {
			resumo,
			metodologia,
			nome: nomeProjeto,
			status: statusProjeto,
			conclusao,
			categoria_id,
			estado_id,
			introducao,
			objetivo,
			result_disc,
		} = ProjetoFactory.create()
			.withCategoria(categoriaId)
			.withEstado(estadoId)
			.withUsuarios([String(usuario?.id)])
			.build();
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
		defaultUsuarioId = String(usuario?.id);
	};

	beforeAll(async () => {
		await prepararDadosTeste();
	});

	it("deve criar uma solicitação com os dados corretos", async () => {
		const input = {
			titulo: "teste",
			descricao: "teste",
			projeto_id: defaultProjetoId,
			creator_id: defaultUsuarioId,
			status: "aguardando",
		};
		const output = await solicitacaoModel.create(input as ISolicitacaoDTO);
		expect(output.id).toBeDefined();
		expect(output.titulo).toEqual(input.titulo);
		expect(output.descricao).toEqual(input.descricao);
		expect(output.projeto_id).toEqual(input.projeto_id);
		expect(output.creator_id).toEqual(input.creator_id);
		expect(output.status).toEqual(input.status);
	});

	it("deve popular o modelo com os dados da solicitação existente", async () => {
		const input = {
			titulo: "teste",
			descricao: "teste",
			projeto_id: defaultProjetoId,
			creator_id: defaultUsuarioId,
			status: "aguardando",
		};
		const output = await solicitacaoModel.create(input as ISolicitacaoDTO);
		const outputPopulated = await solicitacaoModel.populate(output.id as string);
		expect(outputPopulated.id).not.toBeNull();
		expect(outputPopulated.id).toEqual(output.id);
		expect(outputPopulated.titulo).toEqual(output.titulo);
		expect(outputPopulated.descricao).toEqual(output.descricao);
		expect(outputPopulated.projeto_id).toEqual(output.projeto_id);
		expect(outputPopulated.creator_id).toEqual(output.creator_id);
		expect(outputPopulated.status).toEqual(output.status);
	});

	it("deve atualizar os dados da solicitação", async () => {
		const input = {
			titulo: "teste",
			descricao: "teste",
			projeto_id: defaultProjetoId,
			creator_id: defaultUsuarioId,
			status: "aguardando",
		};
		const solicitacao = await solicitacaoModel.create(input as ISolicitacaoDTO);
		const output = await solicitacaoModel.update(String(solicitacao.id), {
			descricao: "modificada",
			status: "alterado",
			titulo: "modificado",
		});
		expect(input.descricao).not.toEqual(output.descricao);
		expect(input.status).not.toEqual(output.status);
		expect(input.titulo).not.toEqual(output.titulo);
	});

	it("deve retornar uma lista paginada", async () => {
		const output = await solicitacaoModel.list();
		expect(output).toHaveProperty("data");
		expect(output).toHaveProperty("page");
		expect(output).toHaveProperty("perPage");
		expect(output).toHaveProperty("count");
		expect(output).toHaveProperty("totalPages");
	});

	it("deve retornar uma lista de SolicitacaoDTO", async () => {
		const output = await solicitacaoModel.list();
		expect(output.data).instanceOf(Array);
		expect(output.data.every((solicitaco) => solicitaco instanceof SolicitacaoDTO)).toBeTruthy();
	});

	it.each(SOLICITACAO_STATUS_VALUES)("deve retornar apenas solicitações com o STATUS: %s", async (status) => {
		const input = {
			titulo: "teste",
			descricao: "teste",
			projeto_id: defaultProjetoId,
			creator_id: defaultUsuarioId,
			status,
		};
		await solicitacaoModel.create(input as ISolicitacaoDTO);
		const output = await solicitacaoModel.list({ status });
		expect(output.data.every((solicitacao) => solicitacao.status === status)).toBeTruthy();
	});

	it("deve deletar uma solicitação", async () => {
		const input = {
			titulo: "teste",
			descricao: "teste",
			projeto_id: defaultProjetoId,
			creator_id: defaultUsuarioId,
			status: "aguardando",
		};
		const { id } = await solicitacaoModel.create(input as ISolicitacaoDTO);
		const output = await solicitacaoModel.delete(String(id));
		expect(output.id).toBeNull();
	});
});
