import type { Knex } from "knex";
import type { IEstadoDTO } from "../dto/index.js";
import { EstadoDTO } from "../dto/EstadoDTO.js";
import dbConnection from "../database/dbConfig.js";

export interface IEstadoModel {
	list(): Promise<IEstadoDTO[]>;
}

export class EstadoModel implements IEstadoModel {
	protected dto = EstadoDTO;

	protected table = "estados";
	protected tableTag = "Estado";
	private get db(): Knex.QueryBuilder {
		return this.connection.table(this.table);
	}

	constructor(private readonly connection: Knex = dbConnection) {}

	async list(): Promise<EstadoDTO[]> {
		const rows = await this.db.select<EstadoDTO[]>("id", "estado").orderBy("estado", "asc");
		return rows.map((row) => new this.dto(row));
	}
}
