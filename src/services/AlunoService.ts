import type { Knex } from "knex";
import { AlunoDTO, type IAlunoDTO } from "../dto/AlunoDTO.js";
import { AlunoModel } from "../models/index.js";

type TCreateDTO = Pick<IAlunoDTO, "user_id" | "curso_id" | "serie_id">;

export interface IAlunoService {
	create(dto: TCreateDTO, transaction?: Knex): Promise<IAlunoDTO>;
}

export class AlunoService implements IAlunoService {
	protected model = AlunoModel;
	protected dto = AlunoDTO;

	async create(dto: TCreateDTO, transaction?: Knex): Promise<IAlunoDTO> {
		const model = new this.model(transaction);
		const aluno = await model.create(dto);
		return aluno;
	}
}
