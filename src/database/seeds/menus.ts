import type { Knex } from "knex";
import { v4 as uuidV4 } from "uuid";

export async function seed(knex: Knex): Promise<void> {
	await knex("menus").del();

	await knex("menus").insert([
		{ id: uuidV4(), nome: "Início", url: "/" },
		{ id: uuidV4(), nome: "Categorias", url: "" },
		{ id: uuidV4(), nome: "Ajuda", url: "ajuda" },
	]);
}
