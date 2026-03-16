import type { IProjetoService } from "./ProjetoService.js";
import { BaseService, type IBaseService, type TListBaseServiceDTO } from "./BaseService.js";
import { SolicitacaoDTO, type ISolicitacaoDTO, type TSolicitacaoStatus } from "../dto/SolicitacaoDTO.js";
import type { TPagePaginatedResponse } from "../utils/helpers/pagePaginator.js";
import {
	SolicitacaoModel,
	type TListOrderingSolicitacao,
	type TListWhereSolicitacao,
} from "../models/SolicitacaoModel.js";
import type { INotificacaoService } from "./NotificacaoService.js";

export const UPDATE_TIPO_ALTERACAO_SOLICITACAO = ["alteracao_dados", "solicitar_analise", "aprovacao"] as const;

export type TUpdateTipoAlteracaoSolicitacaoService = (typeof UPDATE_TIPO_ALTERACAO_SOLICITACAO)[number];

type TCreateDTOSolicitacaoService = Pick<ISolicitacaoDTO, "titulo" | "descricao" | "creator_id" | "projeto_id">;
type TUpdateDTOSolicitacaoService = Partial<Pick<ISolicitacaoDTO, "descricao" | "titulo" | "status">> & {
	tipo_alteracao: TUpdateTipoAlteracaoSolicitacaoService;
};
// tipo_alteracao
// 1 -> apenas titulo / descricao -> dados
// 2 -> aprovar para analise
// 3 -> aprovar projeto
export type TFindOneWhereSolicitacaoService = { id?: string; projeto_id?: string; status?: TSolicitacaoStatus };

type TContructorService = {
	projetoService: IProjetoService;
	notificacaoService: INotificacaoService;
};

export interface ISolicitacaoService extends IBaseService {
	create(dto: TCreateDTOSolicitacaoService): Promise<ISolicitacaoDTO>;
	update(id: string, dto: TUpdateDTOSolicitacaoService): Promise<ISolicitacaoDTO>;
	delete(id: string): Promise<boolean>;
	get(id: string): Promise<ISolicitacaoDTO | null>;
	findOne(where: TFindOneWhereSolicitacaoService): Promise<ISolicitacaoDTO>;
	list(
		filter?: TListBaseServiceDTO<TListWhereSolicitacao, TListOrderingSolicitacao>,
	): Promise<TPagePaginatedResponse<ISolicitacaoDTO>>;
}

export class SolicitacaoService
	extends BaseService<
		SolicitacaoDTO,
		SolicitacaoModel,
		TCreateDTOSolicitacaoService,
		TUpdateDTOSolicitacaoService,
		TFindOneWhereSolicitacaoService,
		TListWhereSolicitacao,
		TListOrderingSolicitacao
	>
	implements ISolicitacaoService
{
	protected model = SolicitacaoModel;
	protected dto = SolicitacaoDTO;
	private projetoService: IProjetoService;
	private notificacaoService: INotificacaoService;

	constructor({ projetoService, notificacaoService }: TContructorService) {
		super();
		this.projetoService = projetoService;
		this.notificacaoService = notificacaoService;
	}

	async create(dto: TCreateDTOSolicitacaoService): Promise<SolicitacaoDTO> {
		const { titulo, descricao, creator_id, projeto_id } = dto;
		const model = new this.model();
		const solicitacao = await model.create({ status: "aguardando", titulo, descricao, creator_id, projeto_id });
		await this.projetoService.updateStatus(projeto_id, "alteracao");
		return solicitacao;
	}

	async update(id: string, fields: TUpdateDTOSolicitacaoService): Promise<SolicitacaoDTO> {
		const { tipo_alteracao } = fields;
		const model = new this.model();
		let solicitacao = await model.findOne({ id });
		if (tipo_alteracao === "alteracao_dados") {
			let { titulo, descricao } = fields;
			if (!titulo) titulo = solicitacao.titulo;
			if (!descricao) descricao = solicitacao.descricao;
			return await model.update(id, { titulo, descricao });
		}
		const { status } = fields;
		if (!status) return solicitacao;
		solicitacao = await model.update(id, { status });
		const notificacao = await this.notificacaoService.findOne({ solicitacao_id: String(solicitacao.id) });
		if (notificacao.id !== null) {
			await this.notificacaoService.marcarLida(String(notificacao.id));
			const status = tipo_alteracao === "solicitar_analise" ? "analise" : "aprovado";
			await this.projetoService.updateStatus(solicitacao.projeto_id, status);
		}
		return solicitacao;
	}

	async get(id: string): Promise<SolicitacaoDTO | null> {
		const model = new this.model();
		const entity = await model.populate(id);
		if (!entity.id) return null;
		const solicitacao = await this.getProjeto(entity);
		return solicitacao;
	}

	async list({
		filters,
		pagination = { page: 1, perPage: 10 },
		ordering,
	}: TListBaseServiceDTO<TListWhereSolicitacao, TListOrderingSolicitacao> = {}): Promise<
		TPagePaginatedResponse<SolicitacaoDTO>
	> {
		const model = new this.model();
		const { data, count, page, perPage, totalPages } = await model.list(filters, pagination, ordering);
		const solicitacoes: SolicitacaoDTO[] = [];
		for (const solicitacao of data) {
			const solicitaoFull = await this.getProjeto(solicitacao);
			solicitacoes.push(solicitaoFull);
		}
		return {
			data: solicitacoes,
			count,
			page,
			perPage,
			totalPages,
		};
	}

	private async getProjeto(solicitacao: SolicitacaoDTO): Promise<SolicitacaoDTO> {
		const projeto = await this.projetoService.get(solicitacao.projeto_id);
		solicitacao.projeto = {
			id: String(projeto.id),
			nome: projeto.nome,
		};
		return solicitacao;
	}
}
