import type { Knex } from "knex";
import type { ISerieDTO } from "../dto/index.js";
import { SerieDTO } from "../dto/index.js";
import dbConnection from "../database/dbConfig.js";

export interface ISerieModel {
	list(): Promise<ISerieDTO[]>;
	get(id: string): Promise<ISerieDTO>;
}

export class SerieModel implements ISerieModel {
	protected dto = SerieDTO;

	protected table = "series";
	protected tableTag = "Serie";
	private get db(): Knex.QueryBuilder {
		return this.connection.table(this.table);
	}

	constructor(private readonly connection: Knex = dbConnection) {}

	async list(): Promise<SerieDTO[]> {
		const rows = await this.db.select<SerieDTO[]>("id", "serie").orderBy("serie", "asc");
		return rows.map((row) => new SerieDTO(row));
	}

	async get(id: string): Promise<SerieDTO> {
		const serie = await this.db.where({ id }).first();
		return new this.dto(serie);
	}
}
