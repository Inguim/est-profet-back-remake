import type { Knex } from "knex";
import type { ICursoDTO } from "../dto/index.js";
import { CursoDTO } from "../dto/CursoDTO.js";
import dbConnection from "../database/dbConfig.js";

export interface ICursoModel {
	list(): Promise<ICursoDTO[]>;
}

export class CursoModel implements ICursoModel {
	protected table = "cursos";
	protected tableTag = "Curso";
	private get db(): Knex.QueryBuilder {
		return dbConnection.table(this.table);
	}

	async list(): Promise<CursoDTO[]> {
		const rows = await this.db.select<CursoDTO[]>().orderBy("curso", "asc");
		return rows.map((row) => new CursoDTO(row));
	}
}
