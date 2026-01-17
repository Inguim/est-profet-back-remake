import type { Knex } from "knex";
import dbConnection from "../database/dbConfig.js";
import { v4 as uuidV4 } from "uuid";
import type { IBaseDTO } from "../dto/BaseDTO.js";

export interface IBasePersistable<TDTO> {
	create(): Promise<TDTO>;
	update(): Promise<TDTO>;
	delete(): Promise<void>;
	populate(id: string): Promise<TDTO>;
}

export abstract class BaseModel<T extends IBaseDTO> implements IBasePersistable<T> {
	protected dto: T;

	protected table = "";
	protected tableTag = "";
	private get db(): Knex.QueryBuilder {
		return dbConnection.table(this.table);
	}

	constructor(dto: T) {
		this.dto = dto;
	}

	async populate(id: string): Promise<T> {
		const data = await this.db.where({ id }).first();
		if (data) Object.assign(this.dto, data);
		return this.dto;
	}

	protected async beforeCreate(): Promise<void> {
		return;
	}

	async create(): Promise<T> {
		if (!this.dto.id) {
			this.dto.id = uuidV4();
			await this.beforeCreate();
			const [newRecord] = await this.db.insert(this.dto).returning("*");
			Object.assign(this.dto, newRecord);
		}
		return this.dto;
	}

	async update(): Promise<T> {
		this.dto.updated_at = new Date();
		const [updatedRecord] = await this.db.where({ id: this.dto.id }).update(this.dto).returning("*");
		Object.assign(this.dto, updatedRecord);
		return this.dto;
	}

	async delete(): Promise<void> {
		await this.db.where({ id: this.dto.id }).del();
		this.dto.id = null;
	}
}
