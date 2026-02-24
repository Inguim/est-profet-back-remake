import type { Knex } from "knex";
import type { ICategoriaDTO } from "../dto/index.js";
import { CategoriaDTO } from "../dto/CategoriaDTO.js";
import dbConnection from "../database/dbConfig.js";

export type TListWhere = {
	id?: string[];
	nome__ilike?: string;
	descricao__ilike?: string;
	slug?: string;
	menu_id?: string;
};

const LIST_WHERE_KEYS = ["id", "nome__ilike", "descricao__ilike", "slug", "menu_id"] as const;

export interface ICategoriaModel {
	list(where?: TListWhere): Promise<ICategoriaDTO[]>;
}

export class CategoriaModel implements ICategoriaModel {
	protected table = "categorias";
	protected tableTag = "Categoria";
	private get db(): Knex.QueryBuilder {
		return this.connection.table(this.table);
	}

	constructor(private readonly connection: Knex = dbConnection) {}

	private applyFilters(query: Knex.QueryBuilder<any, ICategoriaDTO[]>, where?: TListWhere) {
		if (!where) return query;
		return query.where((qb) => {
			Object.entries(where).forEach(([key, value]) => {
				if (LIST_WHERE_KEYS.includes(key as keyof TListWhere)) {
					if (key === "id") qb.whereIn("id", value as string[]);
					else if (key === "nome__ilike") qb.whereILike("nome", `%${value}%`);
					else if (key === "descricao__ilike") qb.whereILike("descricao", `%${value}%`);
					else if (key === "slug") qb.where("slug", value);
					else if (key === "menu_id") qb.where("menu_id", value);
				}
			});
		});
	}

	async list(where?: TListWhere): Promise<ICategoriaDTO[]> {
		const query = this.db.select<ICategoriaDTO[]>("id", "nome", "slug", "descricao", "menu_id");
		const rows = await this.applyFilters(query, where).orderBy("nome", "asc");
		return rows.map((row) => new CategoriaDTO(row));
	}
}
