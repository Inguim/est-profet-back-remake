import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable("categorias", (table) => {
		table.uuid("id").primary();
		table.string("nome", 255).unique();
		table.string("slug", 255).unique();
		table.text("descricao");

		table.uuid("menu_id").notNullable();

		table.foreign("menu_id").references("id").inTable("menus").onDelete("CASCADE").onUpdate("CASCADE");

		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists("categorias");
}
