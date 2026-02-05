import type { Knex } from "knex";
import type { ISerieDTO } from "../dto/index.js";
import { SerieDTO } from "../dto/index.js";
import dbConnection from "../database/dbConfig.js";

export interface ISerieModel {
	list(): Promise<ISerieDTO[]>;
}

export class SerieModel implements ISerieModel {
	protected table = "series";
	protected tableTag = "Serie";
	private get db(): Knex.QueryBuilder {
		return dbConnection.table(this.table);
	}

	async list(): Promise<SerieDTO[]> {
		const rows = await this.db.select<SerieDTO[]>("id", "serie").orderBy("serie", "asc");
		return rows.map((row) => new SerieDTO(row));
	}
}
