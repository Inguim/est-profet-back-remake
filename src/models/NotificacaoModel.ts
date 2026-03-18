import type { Knex } from "knex";
import { NotificacaoDTO, type INotificacaoDTO } from "../dto/NotificacaoDTO.js";
import dbConnection from "../database/dbConfig.js";
import { v4 as uuidV4 } from "uuid";
import { SOLICITACAO_STATUS, type TSolicitacaoStatus, type TSolicitacaoStatusLabel } from "../dto/SolicitacaoDTO.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { PagePaginator, type TPagePaginatedResponse, type TPagePagination } from "../utils/helpers/pagePaginator.js";
import { formatOrderBy } from "../utils/helpers/formatOrderBy.js";

export type TNotificacaoListOrderBy = "updated_at__desc";

export type TNotificacaoListWhere = {
	solicitacao_id?: string;
	user_id?: string;
	visto?: boolean;
};

export type TCreateModelNotificacaoDTO = {
	tipo_id: string;
	solicitacao_id: string;
	user_id: string;
};

export type TUpdateModelNotificacaoDTO = {
	visto: boolean;
};

export type TFindOneModelNotificacaoParams = {
	solicitacao_id?: string;
};

type TNotificacaoRow = {
	id: string;
	visto: boolean;
	tipo_id: string;
	user_id: string;
	created_at: Date;
	updated_at: Date;
	solicitacao_id: string;
	solicitacao_titulo: string;
	solicitacao_descricao: string;
	solicitacao_status: TSolicitacaoStatus;
	projeto_id: string;
	projeto_nome: string;
};

const LIST_WHERE_KEYS = ["solicitacao_id", "visto", "user_id"] as const;

export interface INotificaoModel {
	create(dto: TCreateModelNotificacaoDTO): Promise<INotificacaoDTO>;
	get(id: string): Promise<INotificacaoDTO>;
	update(id: string, dto: TUpdateModelNotificacaoDTO): Promise<INotificacaoDTO>;
	findOne(params: TFindOneModelNotificacaoParams): Promise<INotificacaoDTO>;
	list(
		where?: TNotificacaoListWhere,
		pagination?: TPagePagination,
		orderBy?: TNotificacaoListOrderBy,
	): Promise<TPagePaginatedResponse<INotificacaoDTO>>;
}

export class NotificacaoModel implements INotificaoModel {
	protected table = "notificacaos";
	protected tableTag = "Notificação";
	protected dto = NotificacaoDTO;

	private DEFAULT_ORDERING: TNotificacaoListOrderBy = "updated_at__desc";
	private paginationHandler = new PagePaginator();
	private get db(): Knex.QueryBuilder {
		return this.connection.table(this.table);
	}

	constructor(private readonly connection: Knex = dbConnection) {}

	async create(dto: TCreateModelNotificacaoDTO): Promise<NotificacaoDTO> {
		const { solicitacao_id, tipo_id, user_id } = dto;
		const [newRecord] = await this.db
			.insert({
				id: uuidV4(),
				visto: false,
				solicitacao_id,
				tipo_id,
				user_id,
				created_at: new Date(),
				updated_at: new Date(),
			})
			.returning("id");
		return this.get(newRecord.id);
	}

	async get(id: string): Promise<NotificacaoDTO> {
		const querySelect = this.formatedSelectQuery();
		const rowNotificacao = await querySelect.where("notificacaos.id", id).first();
		if (!rowNotificacao) throw new NotFoundError(`${this.tableTag} não encontrado`);
		return this.rowToDTO(rowNotificacao);
	}

	async update(id: string, dto: TUpdateModelNotificacaoDTO): Promise<NotificacaoDTO> {
		const { visto } = dto;
		const [{ count: existeNotificacao }] = await this.db.where({ id }).count();
		if (Number(existeNotificacao) === 0) throw new NotFoundError(`${this.tableTag} de ${id} não encontrado`);
		const [updatedRowNotificacao] = await this.db
			.where({ id })
			.update({ visto, updated_at: new Date() })
			.returning("id");
		return this.get(updatedRowNotificacao.id);
	}

	async findOne(params: TFindOneModelNotificacaoParams): Promise<INotificacaoDTO> {
		const data = await this.db
			.where(params as object)
			.orderBy("updated_at", "desc")
			.first();
		const entity = new this.dto(data);
		if (entity.id == null) throw new NotFoundError(`${this.tableTag} não encontrado`);
		return entity;
	}

	private applyFilters(query: Knex.QueryBuilder<any, TNotificacaoRow[]>, where?: TNotificacaoListWhere) {
		if (!where) return query;
		return query.where((qb) => {
			Object.entries(where).forEach(([key, value]) => {
				if (LIST_WHERE_KEYS.includes(key as keyof TNotificacaoListWhere)) {
					if (key !== "visto" && !!value) {
						if (key === "solicitacao_id") qb.where("solicitacaos.id", value);
						else if (key === "user_id") qb.where("notificacaos.user_id", value);
					} else if (key === "visto") qb.where("notificacaos.visto", value === true || value === "true");
				}
			});
		});
	}

	async list(
		where?: TNotificacaoListWhere,
		pagination: TPagePagination = { page: 1, perPage: 10 },
		orderBy: TNotificacaoListOrderBy = this.DEFAULT_ORDERING,
	): Promise<TPagePaginatedResponse<NotificacaoDTO>> {
		const { column, sort } = formatOrderBy<TNotificacaoListOrderBy>(orderBy);
		let query = this.formatedSelectQueryArray();
		query = this.applyFilters(query, where).orderBy(column, sort);
		const { data, count, page, perPage, totalPages } = await this.paginationHandler.execute<TNotificacaoRow>(
			query,
			pagination.page,
			pagination.perPage,
			"notificacaos.id",
		);
		return {
			data: data.map((notificao) => this.rowToDTO(notificao)),
			count,
			page,
			perPage,
			totalPages,
		};
	}

	private formatedSelectQuery(): Knex.QueryBuilder<any, TNotificacaoRow> {
		return this.db
			.select<TNotificacaoRow>(
				"notificacaos.id",
				"notificacaos.visto",
				"notificacaos.tipo_id",
				"notificacaos.user_id",
				"notificacaos.created_at",
				"notificacaos.updated_at",
				"solicitacaos.id as solicitacao_id",
				"solicitacaos.titulo as solicitacao_titulo",
				"solicitacaos.descricao as solicitacao_descricao",
				"solicitacaos.status as solicitacao_status",
				"projetos.id as projeto_id",
				"projetos.nome as projeto_nome",
			)
			.join("solicitacaos", "notificacaos.solicitacao_id", "solicitacaos.id")
			.join("projetos", "solicitacaos.projeto_id", "projetos.id");
	}

	private formatedSelectQueryArray(): Knex.QueryBuilder<any, TNotificacaoRow[]> {
		return this.db
			.select<
				TNotificacaoRow[]
			>("notificacaos.id", "notificacaos.visto", "notificacaos.tipo_id", "notificacaos.user_id", "notificacaos.created_at", "notificacaos.updated_at", "solicitacaos.id as solicitacao_id", "solicitacaos.titulo as solicitacao_titulo", "solicitacaos.descricao as solicitacao_descricao", "solicitacaos.status as solicitacao_status", "projetos.id as projeto_id", "projetos.nome as projeto_nome")
			.join("solicitacaos", "notificacaos.solicitacao_id", "solicitacaos.id")
			.join("projetos", "solicitacaos.projeto_id", "projetos.id");
	}

	private rowToDTO(row: TNotificacaoRow): NotificacaoDTO {
		return new this.dto({
			id: row.id,
			visto: row.visto,
			tipo_id: row.tipo_id,
			user_id: row.user_id,
			created_at: row.created_at,
			updated_at: row.updated_at,
			solicitacao: {
				id: row.solicitacao_id,
				titulo: row.solicitacao_titulo,
				descricao: row.solicitacao_descricao,
				projeto: {
					id: row.projeto_id,
					nome: row.projeto_nome,
				},
				status: {
					value: row.solicitacao_status,
					label: this.getStatusLabel(row.solicitacao_status),
				},
			},
		});
	}

	private getStatusLabel(status: TSolicitacaoStatus): TSolicitacaoStatusLabel {
		return SOLICITACAO_STATUS[status];
	}
}
