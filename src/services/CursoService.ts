import { CursoDTO } from "../dto/CursoDTO.js";
import { CursoModel } from "../models/CursoModel.js";

export interface ICursoService {
	list(): Promise<CursoDTO[]>;
}

export class CursoService implements ICursoService {
	protected model = CursoModel;
	protected dto = CursoDTO;

	async list(): Promise<CursoDTO[]> {
		const model = new CursoModel();
		const results = await model.list();
		return results;
	}
}
