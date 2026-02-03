import { UsuarioDTO } from "../dto/index.js";
import { UsuarioModel } from "../models/index.js";
import { BaseService, type IBaseService } from "./BaseService.js";

type TCreateDTO = Pick<UsuarioDTO, "nome" | "email" | "tipo" | "password">;
type TUpdateDTO = Partial<Pick<UsuarioDTO, "nome" | "email" | "tipo">>;
export type TFindOneDTO = Partial<Pick<UsuarioDTO, "email">>;

export interface IUsuarioService extends IBaseService {
	create(fields: TCreateDTO): Promise<UsuarioDTO>;
	update(id: string, fields: TUpdateDTO): Promise<UsuarioDTO>;
	delete(id: string): Promise<boolean>;
	get(id: string): Promise<UsuarioDTO | null>;
	findOne(where: TFindOneDTO): Promise<UsuarioDTO>;
}

export class UsuarioService
	extends BaseService<UsuarioDTO, UsuarioModel, TCreateDTO, TUpdateDTO, TFindOneDTO>
	implements IUsuarioService
{
	protected model = UsuarioModel;
	protected dto = UsuarioDTO;
}
