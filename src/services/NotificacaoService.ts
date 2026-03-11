import type { INotificacaoDTO, NotificacaoDTO } from "../dto/NotificacaoDTO.js";
import type { ITipoNotificacaoService } from "./TipoNotificacaoService.js";
import {
	NotificacaoModel,
	type TNotificacaoListOrderBy,
	type TNotificacaoListWhere,
} from "../models/NotificacaoModel.js";
import type { TPagePaginatedResponse, TPagePagination } from "../utils/helpers/pagePaginator.js";

type TCreateServiceNoticacaoDTO = {
	solicitacao_id: string;
	user_id: string;
};

type TListNotificacaoDTO = {
	filters?: TNotificacaoListWhere;
	pagination?: TPagePagination;
	ordering?: TNotificacaoListOrderBy;
};

export interface INotificacaoService {
	create(dto: TCreateServiceNoticacaoDTO): Promise<INotificacaoDTO>;
	get(id: string): Promise<INotificacaoDTO>;
	marcarLida(id: string): Promise<INotificacaoDTO>;
	list(filter?: TListNotificacaoDTO): Promise<TPagePaginatedResponse<INotificacaoDTO>>;
}

type TConstructorService = {
	tipoNotificacaoService: ITipoNotificacaoService;
};

export class NotificacaoService implements INotificacaoService {
	private model = NotificacaoModel;
	private tipoNotificacaoService: ITipoNotificacaoService;

	constructor({ tipoNotificacaoService }: TConstructorService) {
		this.tipoNotificacaoService = tipoNotificacaoService;
	}

	async create(dto: TCreateServiceNoticacaoDTO): Promise<NotificacaoDTO> {
		const tipoSolicitacao = await this.tipoNotificacaoService.get("solicitacao");
		const { solicitacao_id, user_id } = dto;
		const model = new this.model();
		const notificacao = await model.create({ tipo_id: String(tipoSolicitacao.id), solicitacao_id, user_id });
		return notificacao;
	}

	async get(id: string): Promise<NotificacaoDTO> {
		const model = new this.model();
		const notificacao = await model.get(id);
		return notificacao;
	}

	async list({
		filters,
		pagination = { page: 1, perPage: 5 },
		ordering = "updated_at__desc",
	}: TListNotificacaoDTO = {}): Promise<TPagePaginatedResponse<NotificacaoDTO>> {
		const model = new this.model();
		const { data, count, page, perPage, totalPages } = await model.list(filters, pagination, ordering);
		return {
			data,
			count,
			page,
			perPage,
			totalPages,
		};
	}

	async marcarLida(id: string): Promise<NotificacaoDTO> {
		const model = new this.model();
		const notificacaoVista = await model.update(id, { visto: true });
		return notificacaoVista;
	}
}
