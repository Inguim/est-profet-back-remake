import { CategoriaDTO, type ICategoriaDTO } from "../dto/CategoriaDTO.js";
import { CategoriaModel, type TListWhere } from "../models/CategoriaModel.js";

export type TListFilterBy = TListWhere;

export interface ICategoriaService {
	list(filters?: TListFilterBy): Promise<ICategoriaDTO[]>;
}

export class CategoriaService implements ICategoriaService {
	protected model = CategoriaModel;
	protected dto = CategoriaDTO;

	async list(filters?: TListFilterBy): Promise<CategoriaDTO[]> {
		const model = new this.model();
		const results = await model.list(filters);
		return results;
	}
}
