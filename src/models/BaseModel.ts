import type { Knex } from "knex";
import dbConnection from "../database/dbConfig.js";
import { v4 as uuidV4 } from "uuid";
import type { DTOConstructor, IBaseDTO } from "../dto/BaseDTO.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { PagePaginator, type TPagePaginatedResponse, type TPagePagination } from "../utils/helpers/pagePaginator.js";
import { formatOrderBy } from "../utils/helpers/formatOrderBy.js";

export interface IBaseModel {
	create(dto: any): Promise<any>;
	update(id: string, dto: any): Promise<any>;
	delete(id: string): Promise<any>;
	populate(id: string): Promise<any>;
	findOne(params: any): Promise<any>;
	list(where?: any, pagination?: TPagePagination, orderBy?: any): Promise<TPagePaginatedResponse<any>>;
}

export type ModelConstructor<I> = new (fields?: any) => I;

export type TUpdateModelDTO<T> = Partial<Omit<T, "id" | "created_at" | "updated_at">>;
export type TCreateModelDTO<T> = Partial<Omit<T, "id" | "created_at" | "updated_at">>;
export type TFindOneModelDTO<T> = Partial<Omit<T, "created_at" | "updated_at">>;

export type TListOrderByBaseModel = "updated_at__asc" | "created_at__asc" | "created_at__desc";

export abstract class BaseModel<
	TDTO extends IBaseDTO,
	TCREATE_DTO,
	TUPDATE_DTO,
	TFINDONE_DTO,
	TLISTWHERE_DTO,
	TLISTORDERBY = TListOrderByBaseModel,
> implements IBaseModel {
	protected abstract dto: DTOConstructor<TDTO>;

	protected abstract table: string;
	protected abstract tableTag: string;
	protected abstract DEFAULT_ORDERING: TLISTORDERBY;
	private paginationHandler = new PagePaginator();
	private get db(): Knex.QueryBuilder {
		return this.connection.table(this.table);
	}

	constructor(private readonly connection: Knex = dbConnection) {}

	async populate(id: string): Promise<TDTO> {
		const data = await this.db.where({ id }).first();
		return new this.dto(data);
	}

	protected async beforeCreate(dto: TCREATE_DTO): Promise<TCREATE_DTO> {
		return { ...dto };
	}

	protected async beforeUpdate(dto: TUPDATE_DTO): Promise<TUPDATE_DTO> {
		return { ...dto };
	}

	async create(dto: TCREATE_DTO): Promise<TDTO> {
		const hookedDto = await this.beforeCreate(dto);
		const [newRecord] = await this.db
			.insert({ id: uuidV4(), created_at: new Date(), updated_at: new Date(), ...hookedDto })
			.returning("*");
		return new this.dto(newRecord);
	}

	async update(id: string, dto: TUPDATE_DTO): Promise<TDTO> {
		const hookedDto = await this.beforeUpdate(dto);
		const [updatedRecord] = await this.db
			.where({ id })
			.update({ ...hookedDto, updated_at: new Date() })
			.returning("*");
		const entity = new this.dto(updatedRecord);
		if (entity.id == null) throw new NotFoundError(`${this.tableTag} de ${id} não encontrado`);
		return entity;
	}

	async delete(id: string): Promise<TDTO> {
		const entity = await this.populate(id);
		await this.db.where({ id: entity.id }).del();
		entity.id = null;
		return entity;
	}

	async findOne(params: TFINDONE_DTO): Promise<TDTO> {
		const data = await this.db.where(params as object).first();
		const entity = new this.dto(data);
		if (entity.id == null) throw new NotFoundError(`${this.tableTag} não encontrado`);
		return entity;
	}

	async list(
		where?: TLISTWHERE_DTO,
		pagination: TPagePagination = { page: 1, perPage: 5 },
		orderBy: TLISTORDERBY = this.DEFAULT_ORDERING,
	): Promise<TPagePaginatedResponse<TDTO>> {
		const { column, sort } = formatOrderBy<TLISTORDERBY>(orderBy);
		let query = this.db.select<TDTO[]>("*");
		query = this.applyFilters(query, where).orderBy(column, sort);
		const { data, count, page, perPage, totalPages } = await this.paginationHandler.execute<TDTO>(
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

	protected applyFilters(query: Knex.QueryBuilder<any, TDTO[]>, where?: any): Knex.QueryBuilder<any, TDTO[]> {
		if (!where) return query;
		return query;
	}
}
