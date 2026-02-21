import type { Knex } from "knex";
import dbConnection from "../database/dbConfig.js";
import { ProfessorDTO, type IProfessorDTO } from "../dto/ProfessorDTO.js";
import { v4 as uuidV4 } from "uuid";

type TCreateModelDTO = Omit<IProfessorDTO, "id" | "created_at" | "updated_at">;

export interface IProfessorModel {
	create(dto: TCreateModelDTO): Promise<IProfessorDTO>;
}

export class ProfessorModel implements IProfessorModel {
	protected table = "professors";
	protected tableTag = "Professor";
	private get db(): Knex.QueryBuilder {
		return this.connection.table(this.table);
	}

	constructor(private readonly connection: Knex = dbConnection) {}

	async create(dto: TCreateModelDTO): Promise<IProfessorDTO> {
		const entity = new ProfessorDTO({
			...dto,
			id: uuidV4(),
			created_at: new Date(),
			updated_at: new Date(),
		});
		const [newRecord] = await this.db.insert(entity).returning("*");
		return new ProfessorDTO(newRecord);
	}
}
