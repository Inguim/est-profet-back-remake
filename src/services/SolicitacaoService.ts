import type { IProjetoService } from "./ProjetoService.js";
import { BaseService, type IBaseService, type TListBaseServiceDTO } from "./BaseService.js";
import { SolicitacaoDTO, type ISolicitacaoDTO } from "../dto/SolicitacaoDTO.js";
import type { TPagePaginatedResponse } from "../utils/helpers/pagePaginator.js";
import {
	SolicitacaoModel,
	type TListOrderingSolicitacao,
	type TListWhereSolicitacao,
} from "../models/SolicitacaoModel.js";

type TCreateDTOSolicitacaoService = Pick<ISolicitacaoDTO, "titulo" | "descricao" | "creator_id" | "projeto_id">;
type TUpdateDTOSolicitacaoService = Partial<Pick<ISolicitacaoDTO, "descricao" | "titulo" | "status">>;
export type TFindOneWhereSolicitacaoService = { id?: string };

type TContructorService = {
	projetoService: IProjetoService;
	// tipo_notificao
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

	constructor({ projetoService }: TContructorService) {
		super();
		this.projetoService = projetoService;
	}

	async create(dto: TCreateDTOSolicitacaoService): Promise<SolicitacaoDTO> {
		const { titulo, descricao, creator_id, projeto_id } = dto;
		const model = new this.model();
		const solicitacao = await model.create({ status: "aguardando", titulo, descricao, creator_id, projeto_id });
		await this.projetoService.updateStatus(projeto_id, "alteracao");
		return solicitacao;
	}

	async update(
		id: string,
		fields: Partial<Pick<ISolicitacaoDTO, "titulo" | "descricao" | "status">>,
	): Promise<SolicitacaoDTO> {
		throw Error("Metodo não implementado");
	}
}
