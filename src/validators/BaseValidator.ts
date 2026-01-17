export type IBaseValidatorResponse<T> = {
	success: boolean;
	extra?: T;
};

export interface IBaseValidator {
	validate(data: any): IBaseValidatorResponse<any>;
}
