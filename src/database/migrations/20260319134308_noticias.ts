import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable("noticias", (table) => {
		table.uuid("id").primary();
		table.string("nome", 50);
		table.string("link", 255);

		table.uuid("user_id").notNullable();

		table.foreign("user_id").references("id").inTable("usuarios").onUpdate("CASCADE").onDelete("CASCADE");

		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists("noticias");
}
