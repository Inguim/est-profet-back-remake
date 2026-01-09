import type { Knex } from "knex";
import dbConnection from "../database/dbConfig.js";
import { NotFoundError } from "../erros/index.js";
import { v4 as uuidV4 } from "uuid";

export interface IBaseFields {
	id?: string | null;
	createdAt?: Date;
	updatedAt?: Date;
}

type TBaseModelConstructor<T> = {
	tableName: string;
	tableTag: string;
	fields?: Partial<T>;
};

export abstract class BaseModel<T extends IBaseFields> {
	id?: string | null;
	createdAt: Date = new Date();
	updatedAt: Date = new Date();

	protected table: string;
	protected tableTag: string;
	private db: Knex.QueryBuilder;

	constructor({ tableName, tableTag, fields }: TBaseModelConstructor<T>) {
		this.table = tableName;
		this.tableTag = tableTag;
		this.db = dbConnection(this.table);

		if (fields) {
			if (fields.id !== undefined) this.populate(fields.id as string);
			else Object.assign(this, fields);
		}
	}

	private async populate(id: string): Promise<void> {
		const data = await dbConnection(this.table).where({ id }).first();
		if (!data) throw new NotFoundError(`${this.tableTag} com ID ${id} não encontrado`);
		Object.assign(this, data);
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
