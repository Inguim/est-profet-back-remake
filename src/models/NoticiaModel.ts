import type { Knex } from "knex";
import dbConnection from "../database/dbConfig.js";
import { NoticiaDTO, type INoticiaDTO } from "../dto/NoticiaDTO.js";
import { BaseModel } from "./BaseModel.js";
import type { TPagePaginatedResponse, TPagePagination } from "../utils/helpers/pagePaginator.js";

export type TCreateModelNoticiaDTO = Required<Pick<INoticiaDTO, "nome" | "link" | "user_id">>;
export type TUpdateModelNoticiaDTO = Pick<INoticiaDTO, "nome" | "link" | "user_id">;
export type TFindOneModelNoticiaParams = {
	id?: string;
	user_id?: string;
};
export type TListWhereNoticia = {
	user_id?: string;
};
export type TListOrderingNoticia = "updated_at__desc";

const LIST_WHERE_KEYS = ["user_id"] as const;

export interface INoticiaModel {
	create(dto: TCreateModelNoticiaDTO): Promise<INoticiaDTO>;
	update(id: string, dto: TUpdateModelNoticiaDTO): Promise<INoticiaDTO>;
	delete(id: string): Promise<INoticiaDTO>;
	populate(id: string): Promise<INoticiaDTO>;
	findOne(params: TFindOneModelNoticiaParams): Promise<INoticiaDTO>;
	list(
		where?: TListWhereNoticia,
		pagination?: TPagePagination,
		orderBy?: TListOrderingNoticia,
	): Promise<TPagePaginatedResponse<INoticiaDTO>>;
}

export class NoticiaModel
	extends BaseModel<
		NoticiaDTO,
		TCreateModelNoticiaDTO,
		TUpdateModelNoticiaDTO,
		TFindOneModelNoticiaParams,
		TListWhereNoticia,
		TListOrderingNoticia
	>
	implements INoticiaModel
{
	protected DEFAULT_ORDERING: TListOrderingNoticia = "updated_at__desc";
	protected table = "noticias";
	protected tableTag = "Noticia";
	protected dto = NoticiaDTO;

	constructor(connection: Knex = dbConnection) {
		super(connection);
	}

	protected applyFilters(
		query: Knex.QueryBuilder<any, INoticiaDTO[]>,
		where?: TListWhereNoticia,
	): Knex.QueryBuilder<any, INoticiaDTO[]> {
		if (!where) return query;
		return query.where((qb) => {
			Object.entries(where).forEach(([key, value]) => {
				if (LIST_WHERE_KEYS.includes(key as keyof TListWhereNoticia) && !!value) {
					if (key === "user_id") qb.where("user_id", value);
				}
			});
		});
	}
}
