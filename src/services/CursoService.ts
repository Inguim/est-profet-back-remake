import { CursoDTO, type ICursoDTO } from "../dto/CursoDTO.js";
import { CursoModel } from "../models/CursoModel.js";

export interface ICursoService {
	list(): Promise<ICursoDTO[]>;
}

export class CursoService implements ICursoService {
	protected model = CursoModel;
	protected dto = CursoDTO;

	async list(): Promise<CursoDTO[]> {
		const model = new this.model();
		const results = await model.list();
		return results;
	}
}
