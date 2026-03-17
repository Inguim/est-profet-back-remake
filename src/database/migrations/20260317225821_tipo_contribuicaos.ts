import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable("tipo_contribuicaos", (table) => {
		table.uuid("id").primary();
		table.string("nome");

		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists("tipo_contribuicaos");
}
