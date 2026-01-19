import type { IBaseDTO } from "../dto/index.js";
import { BaseModel, type ModelConstructor, type TCreateModelDTO, type TUpdateModelDTO } from "../models/index.js";

export interface IBaseService<BaseModel> {
	create(fields: object): Promise<BaseModel>;
	update(id: string, fields: object): Promise<BaseModel | null>;
	delete(id: string): Promise<boolean>;
	get(id: string): Promise<BaseModel | null>;
}

export type DTOConstructor<I> = new (fields?: any) => I;

export abstract class BaseService<
	IDTO extends IBaseDTO,
	M extends BaseModel<IDTO>,
	TCREATE_DTO extends TCreateModelDTO<IDTO>,
	TUPDATE_DTO extends TUpdateModelDTO<IDTO>,
> {
	protected abstract model: ModelConstructor<M>;
	protected abstract dto: DTOConstructor<IDTO>;

	async create(dto: TCREATE_DTO): Promise<IDTO> {
		const model = new this.model();
		return await model.create(dto);
	}

	async get(id: string): Promise<IDTO | null> {
		const model = new this.model();
		const entity = await model.populate(id);
		return entity.id ? entity : null;
	}

	async update(id: string, fields: TUPDATE_DTO): Promise<IDTO | null> {
		const model = new this.model();
		return model.update(id, fields);
	}

	async delete(id: string): Promise<boolean> {
		const model = new this.model();
		const entity = await model.delete(id);
		return !!entity.id;
	}
}
