import type { Knex } from "knex";
import type { IMenuDTO } from "../dto/index.js";
import { MenuDTO } from "../dto/MenuDTO.js";
import dbConnection from "../database/dbConfig.js";

export interface IMenuModel {
	list(): Promise<IMenuDTO[]>;
}

export class MenuModel implements IMenuModel {
	protected table = "menus";
	protected tableTag = "Menu";
	private get db(): Knex.QueryBuilder {
		return this.connection.table(this.table);
	}

	constructor(private readonly connection: Knex = dbConnection) {}

	async list(): Promise<MenuDTO[]> {
		const rows = await this.db.select<MenuDTO[]>("id", "nome", "url").orderBy("nome", "asc");
		return rows.map((row) => new MenuDTO(row));
	}
}
