import type { Knex } from "knex";
import dbConnection from "../database/dbConfig.js";
import { ProjetoDTO, type IProjetoDTO, type TProjetoStatus } from "../dto/ProjetoDTO.js";
import { v4 as uuidV4 } from "uuid";
import { formatOrderBy } from "../utils/helpers/formatOrderBy.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { PagePaginator, type TPagePagination, type TPagePaginatedResponse } from "../utils/helpers/pagePaginator.js";

export type TProjetoListOrderBy = "updated_at__asc" | "created_at__asc" | "created_at__desc";

export type TProjetoListWhere = {
	status?: TProjetoStatus;
	categoria_id?: string;
	estado_id?: string;
};

type TCreateModelDTO = Omit<IProjetoDTO, "id" | "created_at" | "updated_at">;
type TUpdateModelDTO = Pick<IProjetoDTO, "status">;

type TListModelResponse = TPagePaginatedResponse<IProjetoDTO>;

const LIST_WHERE_KEYS = ["status", "categoria_id", "estado_id", "orderBy"] as const;

export interface IProjetoModel {
	create(dto: TCreateModelDTO): Promise<IProjetoDTO>;
	update(id: string, dto: TUpdateModelDTO): Promise<IProjetoDTO>;
	delete(id: string): Promise<IProjetoDTO>;
	get(id: string): Promise<IProjetoDTO>;
	list(
		where?: TProjetoListWhere,
		pagination?: TPagePagination,
		orderBy?: TProjetoListOrderBy,
	): Promise<TListModelResponse>;
}

export class ProjetoModel implements IProjetoModel {
	protected table = "projetos";
	protected tableTag = "Projeto";
	protected dto = ProjetoDTO;

	private DEFAULT_ORDERING: TProjetoListOrderBy = "updated_at__asc";
	private paginationHandler = new PagePaginator();
	private get db(): Knex.QueryBuilder {
		return this.connection.table(this.table);
	}

	constructor(private readonly connection: Knex = dbConnection) {}

	async create(dto: TCreateModelDTO): Promise<ProjetoDTO> {
		const entity = new this.dto({
			...dto,
			id: uuidV4(),
			created_at: new Date(),
			updated_at: new Date(),
		});
		const [newRecord] = await this.db.insert(entity).returning("*");
		return new ProjetoDTO(newRecord);
	}

	private applyFilters(query: Knex.QueryBuilder<any, IProjetoDTO[]>, where?: TProjetoListWhere) {
		if (!where) return query;
		return query.where((qb) => {
			Object.entries(where).forEach(([key, value]) => {
				if (LIST_WHERE_KEYS.includes(key as keyof TProjetoListWhere) && !!value) {
					if (key === "status") qb.where("status", value);
					else if (key === "categoria_id") qb.where("categoria_id", value);
					else if (key === "estado_id") qb.where("estado_id", value);
				}
			});
		});
	}

	async list(
		where?: TProjetoListWhere,
		pagination: TPagePagination = { page: 1, perPage: 5 },
		orderBy: TProjetoListOrderBy = this.DEFAULT_ORDERING,
	): Promise<TListModelResponse> {
		const { column, sort } = formatOrderBy<TProjetoListOrderBy>(orderBy);
		let query = this.db.select<IProjetoDTO[]>("*");
		query = this.applyFilters(query, where).orderBy(column, sort);
		const { data, count, page, perPage, totalPages } = await this.paginationHandler.execute<IProjetoDTO>(
			query,
			pagination.page,
			pagination.perPage,
		);
		return {
			data: data.map((projeto) => new this.dto(projeto)),
			count,
			page,
			perPage,
			totalPages,
		};
	}

	async update(id: string, dto: TUpdateModelDTO): Promise<ProjetoDTO> {
		const { status } = dto;
		const [updatedProjeto] = await this.db.where({ id }).update({ status, updated_at: new Date() }).returning("*");
		const projeto = new this.dto(updatedProjeto);
		if (projeto.id == null) throw new NotFoundError(`${this.tableTag} de ${id} não encontrado`);
		return projeto;
	}

	async get(id: string): Promise<ProjetoDTO> {
		const entity = await this.db.where({ id }).first();
		const projeto = new this.dto(entity);
		if (projeto.id == null) throw new NotFoundError(`${this.tableTag} não encontrado`);
		return projeto;
	}

	async delete(id: string): Promise<ProjetoDTO> {
		const projeto = await this.get(id);
		await this.db.where({ id: projeto.id }).del();
		return new this.dto({ ...projeto, id: null });
	}
}
