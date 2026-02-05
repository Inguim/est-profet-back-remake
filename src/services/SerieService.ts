import { SerieDTO, type ISerieDTO } from "../dto/index.js";
import { SerieModel } from "../models/index.js";

export interface ISerieService {
	list(): Promise<ISerieDTO[]>;
}

export class SerieService implements ISerieService {
	protected model = SerieModel;
	protected dto = SerieDTO;

	async list(): Promise<SerieDTO[]> {
		const model = new SerieModel();
		const results = await model.list();
		return results;
	}
}
