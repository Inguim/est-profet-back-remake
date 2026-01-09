import type { Knex } from "knex";
import dbConnection from "../database/dbConfig.js";
// import { NotFoundError } from "../erros/index.js";
import { v4 as uuidV4 } from "uuid";
import type { IBaseDTO } from "../dto/BaseDTO.js";

// export interface IBaseFields {
// 	id?: string | null;
// 	createdAt?: Date;
// 	updatedAt?: Date;
// }
export interface IBasePersistable extends IBaseDTO {
	create(): Promise<void>;
	update(): Promise<void>;
	delete(): Promise<void>;
	populate(id: string): Promise<void>;
}
export abstract class BaseModel<T extends IBaseDTO> implements IBasePersistable {
	id: string | null = null;
	createdAt: Date = new Date();
	updatedAt: Date = new Date();

	protected table = "";
	protected tableTag = "";
	private db: Knex.QueryBuilder;

	constructor(fields?: Partial<T>) {
		this.db = dbConnection(this.table);
		if (fields) Object.assign(this, fields);
	}

	async populate(id: string): Promise<void> {
		const data = await dbConnection(this.table).where({ id }).first();
		// if (!data) throw new NotFoundError(`${this.tableTag} com ID ${id} não encontrado`);
		if (data) Object.assign(this, data);
	}

	protected async beforeCreate(): Promise<void> {
		this.id = uuidV4();
	}

	async create(): Promise<void> {
		if (!this.id) {
			await this.beforeCreate();
			const [newRecord] = await this.db.insert(this).returning("*");
			Object.assign(this, newRecord);
		}
	}

	async update(): Promise<void> {
		this.updatedAt = new Date();
		const [updatedRecord] = await this.db.where({ id: this.id }).update(this).returning("*");
		Object.assign(this, updatedRecord);
	}

	async delete(): Promise<void> {
		await this.db.where({ id: this.id }).del();
		this.id = null;
	}
}
