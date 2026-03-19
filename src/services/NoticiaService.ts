import type { Knex } from "knex";
import { NoticiaDTO, type INoticiaDTO } from "../dto/index.js";
import { NoticiaModel, type TListOrderingNoticia, type TListWhereNoticia } from "../models/index.js";
import { BaseService, type IBaseService, type TListBaseServiceDTO } from "./BaseService.js";
import dbConnection from "../database/dbConfig.js";
import type { TPagePaginatedResponse } from "../utils/helpers/pagePaginator.js";

export type TCreateDTONoticiaService = Pick<INoticiaDTO, "link" | "nome" | "user_id">;
type TUpdateDTONoticiaService = Pick<INoticiaDTO, "nome" | "link" | "user_id">;
export type TFindOneDTONoticiaService = {
	id?: string;
	user_id?: string;
};

type TContructorService = {
	connection?: Knex;
};

export interface INoticiaService extends IBaseService {
	create(fields: TCreateDTONoticiaService): Promise<INoticiaDTO>;
	update(id: string, fields: TUpdateDTONoticiaService): Promise<INoticiaDTO>;
	delete(id: string): Promise<boolean>;
	get(id: string): Promise<INoticiaDTO | null>;
	findOne(where: TFindOneDTONoticiaService): Promise<INoticiaDTO>;
	list(
		filter?: TListBaseServiceDTO<TListWhereNoticia, TListOrderingNoticia>,
	): Promise<TPagePaginatedResponse<INoticiaDTO>>;
}

export class NoticiaService
	extends BaseService<
		NoticiaDTO,
		NoticiaModel,
		TCreateDTONoticiaService,
		TUpdateDTONoticiaService,
		TFindOneDTONoticiaService,
		TListWhereNoticia,
		TListOrderingNoticia
	>
	implements INoticiaService
{
	protected model = NoticiaModel;
	protected dto = NoticiaDTO;
	private connection: Knex;

	constructor({ connection = dbConnection }: TContructorService = {} as TContructorService) {
		super();
		this.connection = connection;
	}
}
