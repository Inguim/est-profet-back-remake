import type { Knex } from "knex";
import dbConnection from "../database/dbConfig.js";
import { AlunoDTO, type IAlunoDTO } from "../dto/AlunoDTO.js";
import { v4 as uuidV4 } from "uuid";

type TCreateModelDTO = Omit<IAlunoDTO, "id" | "created_at" | "updated_at">;

export interface IAlunoModel {
	create(dto: TCreateModelDTO): Promise<IAlunoDTO>;
	get(id: string): Promise<IAlunoDTO>;
}

export class AlunoModel implements IAlunoModel {
	protected table = "alunos";
	protected tableTag = "Aluno";
	private get db(): Knex.QueryBuilder {
		return this.connection.table(this.table);
	}

	constructor(private readonly connection: Knex = dbConnection) {}

	async create(dto: TCreateModelDTO): Promise<IAlunoDTO> {
		const entity = new AlunoDTO({
			...dto,
			id: uuidV4(),
			created_at: new Date(),
			updated_at: new Date(),
		});
		const [newRecord] = await this.db.insert(entity).returning("*");
		return new AlunoDTO(newRecord);
	}

	async get(user_id: string): Promise<IAlunoDTO> {
		const data = await this.db.where({ user_id }).first();
		return new AlunoDTO(data);
	}
}
