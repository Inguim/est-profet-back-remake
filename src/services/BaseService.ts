import type { IBaseDTO } from "../dto/index.js";
import { BaseModel } from "../models/index.js";

export interface IBaseService<BaseModel> {
	create(fields: object): Promise<BaseModel>;
	update(id: string, fields: object): Promise<BaseModel | null>;
	delete(id: string): Promise<boolean>;
	get(id: string): Promise<BaseModel | null>;
}

export type ModelConstructor<I> = new (fields?: any) => I;
export type DTOConstructor<I> = new (fields?: any) => I;

export abstract class BaseService<IDTO extends IBaseDTO, M extends BaseModel<IDTO>, TCREATE_DTO, TUPDATE_DTO> {
	protected abstract model: ModelConstructor<M>;
	protected abstract dto: DTOConstructor<IDTO>;

	async create(dto: TCREATE_DTO): Promise<IDTO> {
		const entity = new this.model(dto);
		return await entity.create();
	}

	async get(id: string): Promise<IDTO | null> {
		const entity = new this.model();
		const data = await entity.populate(id);
		return data.id ? data : null;
	}

	async update(id: string, fields: TUPDATE_DTO): Promise<IDTO | null> {
		const entity = new this.model();
		const data = await entity.populate(id);
		if (!data.id) return null;
		Object.assign(data, fields);
		await entity.update();
		return data;
	}

	async delete(id: string): Promise<boolean> {
		const entity = new this.model();
		const data = await entity.populate(id);
		if (!data.id) return false;
		await entity.delete();
		return data.id === null;
	}
}
