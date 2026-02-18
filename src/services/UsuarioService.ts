import { UsuarioDTO, type IAlunoDTO } from "../dto/index.js";
import { UsuarioModel } from "../models/index.js";
import type { IAlunoService } from "./AlunoService.js";
import { BaseService, type IBaseService } from "./BaseService.js";

type TCreateDTOBase = Pick<UsuarioDTO, "nome" | "email" | "tipo" | "password">;
export type TCreateDTOAluno = { tipo: "aluno" } & Pick<IAlunoDTO, "curso_id" | "serie_id">;
export type TCreateDTOProfessor = { tipo: "professor" }; // ajustar para ProfessorDTO

export type TCreateDTO = TCreateDTOBase & (TCreateDTOAluno | TCreateDTOProfessor);
type TUpdateDTO = Partial<Pick<UsuarioDTO, "nome" | "email" | "tipo">>;
export type TFindOneDTO = Partial<Pick<UsuarioDTO, "email">>;

type TContructorService = {
	alunoService: IAlunoService;
	// professorService: IProfessorService;
};

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
	private alunoService: IAlunoService;
	// protected professorService: IProfessorService;

	constructor({ alunoService }: TContructorService = {} as TContructorService) {
		super();
		this.alunoService = alunoService;
		// this.professorService = professorService;
	}

	async create(dto: TCreateDTO): Promise<UsuarioDTO> {
		const { nome, email, password, tipo } = dto;
		const model = new this.model();
		const usuario = await model.create({ nome, email, password, tipo });
		if (tipo === "aluno") {
			const { curso_id, serie_id } = dto;
			await this.alunoService.create({ user_id: usuario.id as string, curso_id, serie_id });
		}
		// else {
		// 	const {} = dto;
		// 	await this.alunoService.create({ user_id: usuario.id as string });
		// }
		return usuario;
	}
}
