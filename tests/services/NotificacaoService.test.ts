import { beforeAll, describe, expect, it } from "vitest";
import { ProjetoFactory } from "../factories/ProjetoFactory.js";
import type { CategoriaDTO } from "../../src/dto/CategoriaDTO.js";
import type { EstadoDTO } from "../../src/dto/EstadoDTO.js";
import { UsuarioAlunoFactory } from "../factories/UsuarioAlunoFactory.js";
import { ProjetoModel } from "../../src/models/ProjetoModel.js";
import { UsuarioModel } from "../../src/models/UsuarioModel.js";
import { CategoriaModel } from "../../src/models/CategoriaModel.js";
import { EstadoModel } from "../../src/models/EstadoModel.js";
import { SolicitacaoModel } from "../../src/models/SolicitacaoModel.js";
import { NotificacaoDTO } from "../../src/dto/NotificacaoDTO.js";
import { NotificacaoService } from "../../src/services/NotificacaoService.js";
import { TipoNotificacaoService } from "../../src/services/TipoNotificacaoService.js";

describe("NotificacaoService", () => {
	let defaultProjetoId: string;
	let defaultUserId: string;
	let defaultSolicitacaoId: string;

	const tipoNotificacaoService = new TipoNotificacaoService();
	const notificacaoService = new NotificacaoService({ tipoNotificacaoService });

	const preparararDadosTeste = async () => {
		const projetoModel = new ProjetoModel();
		const usuarioModel = new UsuarioModel();
		const categoriasModel = new CategoriaModel();
		const estadoModel = new EstadoModel();
		const solicitacaoModel = new SolicitacaoModel();

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
		await preparararDadosTeste();
	});

	it("deve criar uma notificaçao", async () => {
		const output = await notificacaoService.create({ solicitacao_id: defaultSolicitacaoId, user_id: defaultUserId });
		expect(output).instanceOf(NotificacaoDTO);
		expect(output.id).toBeDefined();
	});

	it("deve encontrar uma notificação pelo ID", async () => {
		const input = await notificacaoService.create({ solicitacao_id: defaultSolicitacaoId, user_id: defaultUserId });
		const output = await notificacaoService.get(String(input.id));
		expect(output).toStrictEqual(input);
	});

	it("deve encontrar uma notificação pelo SOLICITACAO_ID", async () => {
		const output = await notificacaoService.findOne({ solicitacao_id: defaultSolicitacaoId });
		expect(output).toBeInstanceOf(NotificacaoDTO);
	});

	it("deve marcar como visualizada uma notificação", async () => {
		const input = await notificacaoService.create({ solicitacao_id: defaultSolicitacaoId, user_id: defaultUserId });
		const output = await notificacaoService.marcarLida(String(input.id));
		expect(output.id).toEqual(output?.id);
		expect(output.visto).toBeTruthy();
	});

	it("deve retornar uma lista de notificações paginada", async () => {
		const output = await notificacaoService.list();
		expect(output).toHaveProperty("data");
		expect(output.data.every((notificacao) => notificacao instanceof NotificacaoDTO)).toBeTruthy();
		expect(output).toHaveProperty("count");
		expect(output).toHaveProperty("page");
		expect(output).toHaveProperty("perPage");
		expect(output).toHaveProperty("totalPages");
	});

	it("deve aplicar filtros ao listar", async () => {
		const { id } = await notificacaoService.create({ solicitacao_id: defaultSolicitacaoId, user_id: defaultUserId });
		const outputNotFiltred = await notificacaoService.list();
		const outputFiltred = await notificacaoService.list({ filters: { solicitacao_id: String(id) } });
		expect(outputNotFiltred.count).not.toEqual(outputFiltred.count);
	});
});
