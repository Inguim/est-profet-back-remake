import type { Knex } from "knex";
import { CategoriaDTO, type ICategoriaDTO } from "../dto/CategoriaDTO.js";
import { ProfessorCategoriaDTO, type IProfessorCategoriaDTO } from "../dto/ProfessorCategoriaDTO.js";
import { ProfessorCategoriaModel } from "../models/ProfessorCategoriaModel.js";
import type { ICategoriaService } from "./CategoriaService.js";

type TCreateDTO = {
	professorId: string;
	categoriaIds: string[];
};

type TConstructorService = {
	categoriaService: ICategoriaService;
};

export interface IProfessorCategoriaService {
	create(dto: TCreateDTO, transaction?: Knex): Promise<IProfessorCategoriaDTO[]>;
	list(professorId: string): Promise<ICategoriaDTO[]>;
}

export class ProfessorCategoriaService implements IProfessorCategoriaService {
	protected model = ProfessorCategoriaModel;
	protected dto = ProfessorCategoriaDTO;
	private categoriaService: ICategoriaService;

	constructor({ categoriaService }: TConstructorService) {
		this.categoriaService = categoriaService;
	}

	async create(dto: TCreateDTO, transaction?: Knex): Promise<ProfessorCategoriaDTO[]> {
		const { professorId, categoriaIds } = dto;
		const model = new this.model(transaction);
		const categorias = await model.create(professorId, categoriaIds);
		return categorias;
	}

	async list(professorId: string): Promise<CategoriaDTO[]> {
		const model = new this.model();
		const categoriaIds = (await model.list(professorId)).map((categoria) => String(categoria.categoria_id));
		const categorias = await this.categoriaService.list({ id: categoriaIds });
		return categorias;
	}
}
