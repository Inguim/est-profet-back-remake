export interface IBaseDTO {
	id?: string | null;
	created_at?: Date;
	updated_at?: Date;
}

export type DTOConstructor<I> = new (fields?: any) => I;
