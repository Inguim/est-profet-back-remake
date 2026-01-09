import type { IBaseDTO } from "../dto/index.js";
import { type IBasePersistable } from "../models/index.js";

export interface IBaseService<BaseModel> {
	create(fields: object): Promise<BaseModel>;
	update(id: string, fields: object): Promise<BaseModel | null>;
	delete(id: string): Promise<boolean>;
	get(id: string): Promise<BaseModel | null>;
}

export type ModelConstructor<I> = new (fields?: any) => I;
export type DTOConstructor<I> = new (fields?: any) => I;

export abstract class BaseService<IDTO extends IBaseDTO, M extends IBasePersistable, TCREATE_DTO, TUPDATE_DTO> {
	protected abstract model: ModelConstructor<M>;
	protected abstract dto: DTOConstructor<IDTO>;

	async create(dto: TCREATE_DTO): Promise<IDTO> {
		const entity = new this.model(dto);
		await entity.create();
		return new this.dto(entity);
	}

	async get(id: string): Promise<IDTO | null> {
		const entity = new this.model();
		await entity.populate(id);
		return entity.id ? new this.dto(entity) : null;
	}

	async update(id: string, fields: TUPDATE_DTO): Promise<IDTO | null> {
		const entity = new this.model();
		await entity.populate(id);
		if (!entity.id) return null;
		Object.assign(entity, fields);
		await entity.update();
		return new this.dto(entity);
	}

	async delete(id: string): Promise<boolean> {
		const entity = new this.model();
		await entity.populate(id);
		if (!entity.id) return false;
		await entity.delete();
		return entity.id === null;
	}
}
