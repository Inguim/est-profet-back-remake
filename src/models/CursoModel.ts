import type { Knex } from "knex";
import type { ICursoDTO } from "../dto/index.js";
import { CursoDTO } from "../dto/CursoDTO.js";
import dbConnection from "../database/dbConfig.js";

export interface ICursoModel {
	list(): Promise<ICursoDTO[]>;
	get(id: string): Promise<ICursoDTO>;
}

export class CursoModel implements ICursoModel {
	protected dto = CursoDTO;

	protected table = "cursos";
	protected tableTag = "Curso";
	private get db(): Knex.QueryBuilder {
		return this.connection.table(this.table);
	}

	constructor(private readonly connection: Knex = dbConnection) {}

	async list(): Promise<CursoDTO[]> {
		const rows = await this.db.select<CursoDTO[]>("id", "curso").orderBy("curso", "asc");
		return rows.map((row) => new this.dto(row));
	}

	async get(id: string): Promise<ICursoDTO> {
		const curso = await this.db.where({ id }).first();
		return new this.dto(curso);
	}
}
