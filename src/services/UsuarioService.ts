import { UsuarioDTO } from "../dto/index.js";
import { Usuario } from "../models/index.js";
import { BaseService } from "./BaseService.js";

type TCreateDTO = Pick<UsuarioDTO, "nome" | "email" | "tipo" | "password">;
type TUpdateDTO = Pick<UsuarioDTO, "nome" | "email" | "tipo">;

export class UsuarioService extends BaseService<UsuarioDTO, Usuario, TCreateDTO, TUpdateDTO> {
	protected model = Usuario;
	protected dto = UsuarioDTO;
}
