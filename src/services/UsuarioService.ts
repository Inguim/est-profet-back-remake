import { UsuarioDTO } from "../dto/index.js";
import { UsuarioModel } from "../models/index.js";
import { BaseService } from "./BaseService.js";

type TCreateDTO = Pick<UsuarioDTO, "nome" | "email" | "tipo" | "password">;
type TUpdateDTO = Pick<UsuarioDTO, "nome" | "email" | "tipo">;
export type TFindOneDTO = Partial<Pick<UsuarioDTO, "email">>;

export class UsuarioService extends BaseService<UsuarioDTO, UsuarioModel, TCreateDTO, TUpdateDTO, TFindOneDTO> {
	protected model = UsuarioModel;
	protected dto = UsuarioDTO;
}
