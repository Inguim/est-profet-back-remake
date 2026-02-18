import { AlunoDTO, type IAlunoDTO } from "../dto/AlunoDTO.js";
import { AlunoModel } from "../models/index.js";

type TCreateDTO = Pick<IAlunoDTO, "user_id" | "curso_id" | "serie_id">;

export interface IAlunoService {
	create(dto: TCreateDTO): Promise<IAlunoDTO>;
}

export class AlunoService implements IAlunoService {
	protected model = AlunoModel;
	protected dto = AlunoDTO;

	async create(dto: TCreateDTO): Promise<IAlunoDTO> {
		const model = new this.model();
		const aluno = await model.create(dto);
		return aluno;
	}
}
