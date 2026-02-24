import { EstadoDTO, type IEstadoDTO } from "../dto/EstadoDTO.js";
import { EstadoModel } from "../models/EstadoModel.js";

export interface IEstadoService {
	list(): Promise<IEstadoDTO[]>;
}

export class EstadoService implements IEstadoService {
	protected model = EstadoModel;
	protected dto = EstadoDTO;

	async list(): Promise<EstadoDTO[]> {
		const model = new this.model();
		const estados = await model.list();
		return estados;
	}
}
