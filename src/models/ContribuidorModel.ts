import type { Knex } from "knex";
import { ContribuidorDTO, type IContribuidorDTO } from "../dto/ContribuidorDTO.js";
import { PagePaginator, type TPagePaginatedResponse, type TPagePagination } from "../utils/helpers/pagePaginator.js";
import dbConnection from "../database/dbConfig.js";
import { v4 as uuidV4 } from "uuid";
import { NotFoundError } from "../errors/NotFoundError.js";
import { formatOrderBy } from "../utils/helpers/formatOrderBy.js";

export type TListOrderByContribuidor = "created_at__asc";

export type TCreateModelContribuidorDTO = {
	github_username: string;
	tipo_contribuicao_id: string;
	user_id: string;
};

export type TUpdateModelContribuidorDTO = {
	github_username: string;
	tipo_contribuicao_id: string;
};

type TContribuidorRow = {
	id: string;
	github_username: string;
	tipo_contribuicao_id: string;
	user_id: string;
	created_at: Date;
	updated_at: Date;
	usuario_id: string;
	usuario_nome: string;
	tipo_contribuicaos_id: string;
	tipo_contribuicaos_nome: string;
};

export interface IContribuidorModel {
	create(dto: TCreateModelContribuidorDTO): Promise<IContribuidorDTO>;
	get(id: string): Promise<IContribuidorDTO>;
	update(id: string, dto: TUpdateModelContribuidorDTO): Promise<IContribuidorDTO>;
	delete(id: string): Promise<IContribuidorDTO>;
	list(pagination?: TPagePagination): Promise<TPagePaginatedResponse<IContribuidorDTO>>;
}

export class ContribuidorModel implements IContribuidorModel {
	protected table = "contribuidors";
	protected tableTag = "Contribuidor";
	protected dto = ContribuidorDTO;

	private DEFAULT_ORDERING: TListOrderByContribuidor = "created_at__asc";
	private paginationHandler = new PagePaginator();
	private get db(): Knex.QueryBuilder {
		return this.connection.table(this.table);
	}

	constructor(private readonly connection: Knex = dbConnection) {}

	async create(dto: TCreateModelContribuidorDTO): Promise<ContribuidorDTO> {
		const { github_username, tipo_contribuicao_id, user_id } = dto;
		const [newRecord] = await this.db
			.insert({
				id: uuidV4(),
				created_at: new Date(),
				updated_at: new Date(),
				github_username,
				tipo_contribuicao_id,
				user_id,
			})
			.returning("id");
		return this.get(newRecord.id);
	}

	async get(id: string): Promise<ContribuidorDTO> {
		const querySelect = this.formatedSelectQuery();
		const rowContribuidor = await querySelect.where("contribuidors.id", id).first();
		if (!rowContribuidor) throw new NotFoundError(`${this.tableTag} não encontrado`);
		return this.rowToDTO(rowContribuidor);
	}

	async update(id: string, dto: TUpdateModelContribuidorDTO): Promise<ContribuidorDTO> {
		const { github_username, tipo_contribuicao_id } = dto;
		const [{ count: existeContribuidor }] = await this.db.where({ id }).count();
		if (Number(existeContribuidor) === 0) throw new NotFoundError(`${this.tableTag} de ${id} não encontrado`);
		const [updatedRowContribuidor] = await this.db
			.where({ id })
			.update({ github_username, tipo_contribuicao_id, updated_at: new Date() })
			.returning("id");
		return this.get(updatedRowContribuidor.id);
	}

	async delete(id: string): Promise<ContribuidorDTO> {
		const projeto = await this.get(id);
		await this.db.where({ id: projeto.id }).del();
		return new this.dto({ ...projeto, id: null });
	}

	async list(pagination: TPagePagination = { page: 1, perPage: 10 }): Promise<TPagePaginatedResponse<ContribuidorDTO>> {
		const { column, sort } = formatOrderBy<TListOrderByContribuidor>(this.DEFAULT_ORDERING);
		let query = this.formatedSelectQueryArray();
		query = query.orderBy(column, sort);
		const { data, count, page, perPage, totalPages } = await this.paginationHandler.execute<TContribuidorRow>(
			query,
			pagination.page,
			pagination.perPage,
			"contribuidors.id",
		);
		return {
			data: data.map((notificao) => this.rowToDTO(notificao)),
			count,
			page,
			perPage,
			totalPages,
		};
	}

	private formatedSelectQuery(): Knex.QueryBuilder<any, TContribuidorRow> {
		return this.db
			.select<TContribuidorRow>(
				"contribuidors.id",
				"contribuidors.github_username",
				"contribuidors.tipo_contribuicao_id",
				"contribuidors.user_id",
				"contribuidors.created_at",
				"contribuidors.updated_at",
				"usuarios.id as usuario_id",
				"usuarios.nome as usuario_nome",
				"tipo_contribuicaos.id as tipo_contribuicaos_id",
				"tipo_contribuicaos.nome as tipo_contribuicaos_nome",
			)
			.join("usuarios", "contribuidors.user_id", "usuarios.id")
			.join("tipo_contribuicaos", "contribuidors.tipo_contribuicao_id", "tipo_contribuicaos.id");
	}

	private formatedSelectQueryArray(): Knex.QueryBuilder<any, TContribuidorRow[]> {
		return this.db
			.select<
				TContribuidorRow[]
			>("contribuidors.id", "contribuidors.github_username", "contribuidors.tipo_contribuicao_id", "contribuidors.user_id", "contribuidors.created_at", "contribuidors.updated_at", "usuarios.id as usuario_id", "usuarios.nome as usuario_nome", "tipo_contribuicaos.id as tipo_contribuicaos_id", "tipo_contribuicaos.nome as tipo_contribuicaos_nome")
			.join("usuarios", "contribuidors.user_id", "usuarios.id")
			.join("tipo_contribuicaos", "contribuidors.tipo_contribuicao_id", "tipo_contribuicaos.id");
	}

	private rowToDTO(row: TContribuidorRow): ContribuidorDTO {
		return new this.dto({
			id: row.id,
			github_username: row.github_username,
			tipo_contribuicao: {
				id: row.tipo_contribuicao_id,
				nome: row.tipo_contribuicaos_nome,
			},
			usuario: {
				id: row.usuario_id,
				nome: row.usuario_nome,
			},
			created_at: row.created_at,
			updated_at: row.updated_at,
		});
	}
}
