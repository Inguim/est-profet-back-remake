import { EstadoDTO, type IEstadoDTO } from "../dto/EstadoDTO.js";
import { EstadoModel, type TListWhereEstado } from "../models/EstadoModel.js";

export type TListFilterByEstado = TListWhereEstado;

export interface IEstadoService {
	list(filters?: TListFilterByEstado): Promise<IEstadoDTO[]>;
}

export class EstadoService implements IEstadoService {
	protected model = EstadoModel;
	protected dto = EstadoDTO;

	async list(filters?: TListFilterByEstado): Promise<EstadoDTO[]> {
		const model = new this.model();
		const estados = await model.list(filters);
		return estados;
	}
}
