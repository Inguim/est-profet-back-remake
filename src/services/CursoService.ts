import { CursoDTO, type ICursoDTO } from "../dto/CursoDTO.js";
import { CursoModel } from "../models/CursoModel.js";

export interface ICursoService {
	list(): Promise<ICursoDTO[]>;
	get(id: string): Promise<ICursoDTO>;
}

export class CursoService implements ICursoService {
	protected model = CursoModel;
	protected dto = CursoDTO;

	async list(): Promise<CursoDTO[]> {
		const model = new this.model();
		const cursos = await model.list();
		return cursos;
	}

	async get(id: string): Promise<ICursoDTO> {
		const model = new this.model();
		const curso = await model.get(id);
		return curso;
	}
}
