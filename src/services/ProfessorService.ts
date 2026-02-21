import type { Knex } from "knex";
import { ProfessorDTO, type IProfessorDTO } from "../dto/ProfessorDTO.js";
import { ProfessorModel } from "../models/index.js";

type TCreateDTO = Pick<IProfessorDTO, "user_id">;

export interface IProfessorService {
	create(dto: TCreateDTO, transaction?: Knex): Promise<IProfessorDTO>;
}

export class ProfessorService implements IProfessorService {
	protected model = ProfessorModel;
	protected dto = ProfessorDTO;

	async create(dto: TCreateDTO, transaction?: Knex): Promise<IProfessorDTO> {
		const model = new this.model(transaction);
		const professor = await model.create(dto);
		return professor;
	}
}
