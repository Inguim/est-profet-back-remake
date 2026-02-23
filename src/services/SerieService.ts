import { SerieDTO, type ISerieDTO } from "../dto/index.js";
import { SerieModel } from "../models/index.js";

export interface ISerieService {
	list(): Promise<ISerieDTO[]>;
	get(id: string): Promise<ISerieDTO>;
}

export class SerieService implements ISerieService {
	protected model = SerieModel;
	protected dto = SerieDTO;

	async list(): Promise<SerieDTO[]> {
		const model = new this.model();
		const results = await model.list();
		return results;
	}

	async get(id: string): Promise<ISerieDTO> {
		const model = new this.model();
		const serie = await model.get(id);
		return serie;
	}
}
