import type { Knex } from "knex";
import dbConnection from "../database/dbConfig.js";
import { SolicitacaoDTO, type ISolicitacaoDTO, type TSolicitacaoStatus } from "../dto/SolicitacaoDTO.js";
import { BaseModel } from "./BaseModel.js";
import type { TPagePaginatedResponse, TPagePagination } from "../utils/helpers/pagePaginator.js";

export type TCreateModelSolicitacaoDTO = Required<
	Pick<ISolicitacaoDTO, "titulo" | "descricao" | "status" | "creator_id" | "projeto_id">
>;
export type TUpdateModelSolicitacaoDTO = Partial<Pick<ISolicitacaoDTO, "descricao" | "titulo" | "status">>;
export type TFindOneModelSolicitacaoParams = {
	id?: string;
};
export type TListWhereSolicitacao = {
	status?: TSolicitacaoStatus;
};
export type TListOrderingSolicitacao = "updated_at__asc";

const LIST_WHERE_KEYS = ["status"] as const;

export interface ISolicitacaoModel {
	create(dto: TCreateModelSolicitacaoDTO): Promise<ISolicitacaoDTO>;
	update(id: string, dto: TUpdateModelSolicitacaoDTO): Promise<ISolicitacaoDTO>;
	delete(id: string): Promise<ISolicitacaoDTO>;
	populate(id: string): Promise<ISolicitacaoDTO>;
	findOne(params: TFindOneModelSolicitacaoParams): Promise<ISolicitacaoDTO>;
	list(
		where?: TListWhereSolicitacao,
		pagination?: TPagePagination,
		orderBy?: TListOrderingSolicitacao,
	): Promise<TPagePaginatedResponse<ISolicitacaoDTO>>;
}

export class SolicitacaoModel
	extends BaseModel<
		SolicitacaoDTO,
		TCreateModelSolicitacaoDTO,
		TUpdateModelSolicitacaoDTO,
		TFindOneModelSolicitacaoParams,
		TListWhereSolicitacao,
		TListOrderingSolicitacao
	>
	implements ISolicitacaoModel
{
	protected DEFAULT_ORDERING: TListOrderingSolicitacao = "updated_at__asc";
	protected table = "solicitacaos";
	protected tableTag = "Solicitação";
	protected dto = SolicitacaoDTO;

	constructor(connection: Knex = dbConnection) {
		super(connection);
	}

	protected applyFilters(
		query: Knex.QueryBuilder<any, ISolicitacaoDTO[]>,
		where?: TListWhereSolicitacao,
	): Knex.QueryBuilder<any, ISolicitacaoDTO[]> {
		if (!where) return query;
		return query.where((qb) => {
			Object.entries(where).forEach(([key, value]) => {
				if (LIST_WHERE_KEYS.includes(key as keyof TListWhereSolicitacao) && !!value) {
					if (key === "status") qb.where("status", value);
				}
			});
		});
	}
}
