import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable("menus", (table) => {
		table.uuid("id").primary();
		table.string("nome", 255).notNullable().unique();
		table.string("url", 255).notNullable().unique();

		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists("menus");
}
