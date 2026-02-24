import type { Knex } from "knex";
import { UsuarioAlunoDTO, UsuarioDTO, UsuarioProfessorDTO, type IAlunoDTO } from "../dto/index.js";
import { UsuarioModel } from "../models/index.js";
import type { IAlunoService } from "./AlunoService.js";
import { BaseService, type IBaseService } from "./BaseService.js";
import dbConnection from "../database/dbConfig.js";
import type { IProfessorService } from "./ProfessorService.js";
import type { ICursoService } from "./CursoService.js";
import type { ISerieService } from "./SerieService.js";
import type { IProfessorCategoriaService } from "./ProfessorCategoriaService.js";

type TCreateDTOBase = Pick<UsuarioDTO, "nome" | "email" | "tipo" | "password">;
export type TCreateDTOAluno = { tipo: "aluno" } & Pick<IAlunoDTO, "curso_id" | "serie_id">;
export type TCreateDTOProfessor = { tipo: "professor" } & { categoriaIds: string[] };

export type TCreateDTO = TCreateDTOBase & (TCreateDTOAluno | TCreateDTOProfessor);
type TUpdateDTO = Partial<Pick<UsuarioDTO, "nome" | "email" | "tipo">>;
export type TFindOneDTO = Partial<Pick<UsuarioDTO, "email">>;

type TUsuarioPorTipo = UsuarioAlunoDTO | UsuarioProfessorDTO;

type TContructorService = {
	connection?: Knex;
	alunoService: IAlunoService;
	professorService: IProfessorService;
	professorCategoriaService: IProfessorCategoriaService;
	cursoService: ICursoService;
	serieService: ISerieService;
};

export interface IUsuarioService extends IBaseService {
	create(fields: TCreateDTO): Promise<UsuarioDTO>;
	update(id: string, fields: TUpdateDTO): Promise<UsuarioDTO>;
	delete(id: string): Promise<boolean>;
	get(id: string): Promise<TUsuarioPorTipo | null>;
	findOne(where: TFindOneDTO): Promise<UsuarioDTO>;
}

export class UsuarioService
	extends BaseService<UsuarioDTO, UsuarioModel, TCreateDTO, TUpdateDTO, TFindOneDTO>
	implements IUsuarioService
{
	protected model = UsuarioModel;
	protected dto = UsuarioDTO;
	private dtoUsuarioAluno = UsuarioAlunoDTO;
	private dtoUsuarioProfessor = UsuarioProfessorDTO;
	private connection: Knex;
	private alunoService: IAlunoService;
	private professorService: IProfessorService;
	private professorCategoriaService: IProfessorCategoriaService;
	private cursoService: ICursoService;
	private serieService: ISerieService;

	constructor(
		{
			alunoService,
			professorService,
			professorCategoriaService,
			cursoService,
			serieService,
			connection = dbConnection,
		}: TContructorService = {} as TContructorService,
	) {
		super();
		this.connection = connection;
		this.alunoService = alunoService;
		this.professorService = professorService;
		this.professorCategoriaService = professorCategoriaService;
		this.cursoService = cursoService;
		this.serieService = serieService;
	}

	async create(dto: TCreateDTO): Promise<UsuarioDTO> {
		return this.connection.transaction(async (trx) => {
			const { nome, email, password, tipo } = dto;
			const model = new this.model(trx);
			const usuario = await model.create({ nome, email, password, tipo });
			if (tipo === "aluno") {
				const { curso_id, serie_id } = dto;
				await this.alunoService.create({ user_id: String(usuario.id), curso_id, serie_id }, trx);
			} else {
				const { categoriaIds } = dto;
				const professor = await this.professorService.create({ user_id: String(usuario.id) }, trx);
				await this.professorCategoriaService.create({ professorId: String(professor.id), categoriaIds }, trx);
			}
			return usuario;
		});
	}

	async get(id: string): Promise<TUsuarioPorTipo | null> {
		const model = new this.model();
		const entity = await model.populate(id);
		if (entity.id) {
			if (entity.tipo === "aluno") return this.getAluno(entity);
			return this.getProfessor(entity);
		}
		return null;
	}

	private async getAluno(usuario: UsuarioDTO): Promise<UsuarioAlunoDTO> {
		const aluno = await this.alunoService.getByUserId(String(usuario.id));
		const curso = await this.cursoService.get(aluno.curso_id);
		const serie = await this.serieService.get(aluno.serie_id);
		return new this.dtoUsuarioAluno({ ...usuario, curso, serie });
	}

	private async getProfessor(usuario: UsuarioDTO): Promise<UsuarioProfessorDTO> {
		const professor = await this.professorService.getByUserId(String(usuario.id));
		const categorias = await this.professorCategoriaService.list(String(professor.id));
		console.log(categorias);
		return new this.dtoUsuarioProfessor({ ...usuario, categorias });
	}
}
