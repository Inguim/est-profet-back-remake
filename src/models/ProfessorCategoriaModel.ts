import type { Knex } from "knex";
import type { IProfessorCategoriaDTO } from "../dto/index.js";
import { ProfessorCategoriaDTO } from "../dto/ProfessorCategoriaDTO.js";
import dbConnection from "../database/dbConfig.js";
import { v4 as uuidV4 } from "uuid";

export interface IProfessorCategoriaModel {
	create(professorId: string, categoriasIds: string[]): Promise<IProfessorCategoriaDTO[]>;
	list(professorId: string): Promise<IProfessorCategoriaDTO[]>;
}

export class ProfessorCategoriaModel implements IProfessorCategoriaModel {
	protected dto = ProfessorCategoriaDTO;

	protected table = "professor_cats";
	protected tableTag = "Professor categoria";
	private get db(): Knex.QueryBuilder {
		return this.connection.table(this.table);
	}

	constructor(private readonly connection: Knex = dbConnection) {}

	async create(professorId: string, categoriasIds: string[]): Promise<ProfessorCategoriaDTO[]> {
		const categoriasToInsert: IProfessorCategoriaDTO[] = categoriasIds.map((id) => ({
			id: uuidV4(),
			professor_id: professorId,
			categoria_id: id,
			created_at: new Date(),
			updated_at: new Date(),
		}));
		const categorias: IProfessorCategoriaDTO[] = await this.db
			.insert<IProfessorCategoriaDTO>(categoriasToInsert)
			.returning("*");
		return categorias.map((categoria) => new this.dto(categoria));
	}

	async list(professorId: string): Promise<ProfessorCategoriaDTO[]> {
		const categorias = await this.db
			.select<IProfessorCategoriaDTO[]>("id", "professor_id", "categoria_id")
			.where({ professor_id: professorId });
		return categorias.map((categoria) => new this.dto(categoria));
	}

	// async list(): Promise<CursoDTO[]> {
	// 	const rows = await this.db.select<CursoDTO[]>("id", "curso").orderBy("curso", "asc");
	// 	return rows.map((row) => new this.dto(row));
	// }
}
