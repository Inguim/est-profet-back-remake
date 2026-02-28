import type { Knex } from "knex";
import type { IEstadoDTO } from "../dto/index.js";
import { EstadoDTO } from "../dto/EstadoDTO.js";
import dbConnection from "../database/dbConfig.js";

export type TListWhereEstado = {
	id?: string[];
};

const LIST_WHERE_KEYS = ["id"] as const;

export interface IEstadoModel {
	list(where?: TListWhereEstado): Promise<IEstadoDTO[]>;
}

export class EstadoModel implements IEstadoModel {
	protected dto = EstadoDTO;

	protected table = "estados";
	protected tableTag = "Estado";
	private get db(): Knex.QueryBuilder {
		return this.connection.table(this.table);
	}

	constructor(private readonly connection: Knex = dbConnection) {}

	private applyFilters(query: Knex.QueryBuilder<any, IEstadoDTO[]>, where?: TListWhereEstado) {
		if (!where) return query;
		return query.where((qb) => {
			Object.entries(where).forEach(([key, value]) => {
				if (LIST_WHERE_KEYS.includes(key as keyof TListWhereEstado)) {
					if (key === "id") qb.whereIn("id", value as string[]);
				}
			});
		});
	}

	async list(where?: TListWhereEstado): Promise<EstadoDTO[]> {
		const query = this.db.select<EstadoDTO[]>("id", "estado");
		const rows = await this.applyFilters(query, where).orderBy("estado", "asc");
		return rows.map((row) => new this.dto(row));
	}
}
