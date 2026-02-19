import type { Knex } from "knex";
import dbConnection from "../database/dbConfig.js";
import { v4 as uuidV4 } from "uuid";
import type { DTOConstructor, IBaseDTO } from "../dto/BaseDTO.js";
import { NotFoundError } from "../errors/NotFoundError.js";

export interface IBasePersistable {
	create(dto: any): Promise<any>;
	update(id: string, dto: any): Promise<any>;
	delete(id: string): Promise<any>;
	populate(id: string): Promise<any>;
	findOne(params: any): Promise<any>;
}

export type ModelConstructor<I> = new (fields?: any) => I;

export type TUpdateModelDTO<T> = Partial<Omit<T, "id" | "created_at" | "updated_at">>;
export type TCreateModelDTO<T> = Partial<Omit<T, "id" | "created_at" | "updated_at">>;
export type TFindOneModelDTO<T> = Partial<Omit<T, "id" | "created_at" | "updated_at">>;

export abstract class BaseModel<T extends IBaseDTO> implements IBasePersistable {
	protected abstract dto: DTOConstructor<T>;

	protected table = "";
	protected tableTag = "";
	private get db(): Knex.QueryBuilder {
		return this.connection.table(this.table);
	}

	constructor(private readonly connection: Knex = dbConnection) {}

	async populate(id: string): Promise<T> {
		const data = await this.db.where({ id }).first();
		return new this.dto(data);
	}

	protected async beforeCreate(dto: TCreateModelDTO<T>): Promise<TCreateModelDTO<T>> {
		return { ...dto };
	}

	protected async beforeUpdate(dto: TUpdateModelDTO<T>): Promise<TUpdateModelDTO<T>> {
		return { ...dto };
	}

	async create(dto: TCreateModelDTO<T>): Promise<T> {
		const hookedDto = await this.beforeCreate(dto);
		const entity = new this.dto({ id: uuidV4(), ...hookedDto });
		const [newRecord] = await this.db.insert(entity).returning("*");
		Object.assign(entity, newRecord);
		return entity;
	}

	async update(id: string, dto: TUpdateModelDTO<T>): Promise<T> {
		const hookedDto = await this.beforeUpdate(dto);
		const [updatedRecord] = await this.db
			.where({ id })
			.update({ ...hookedDto, updated_at: new Date() })
			.returning("*");
		const entity = new this.dto(updatedRecord);
		if (entity.id == null) throw new NotFoundError(`${this.tableTag} de ${id} não encontrado`);
		return entity;
	}

	async delete(id: string): Promise<T> {
		const entity = await this.populate(id);
		await this.db.where({ id: entity.id }).del();
		entity.id = null;
		return entity;
	}

	async findOne(params: TFindOneModelDTO<T>): Promise<T> {
		const data = await this.db.where(params).first();
		const entity = new this.dto(data);
		if (entity.id == null) throw new NotFoundError(`${this.tableTag} não encontrado`);
		return entity;
	}
}
