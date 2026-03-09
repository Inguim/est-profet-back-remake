import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable("tipos_notificacaos", (table) => {
		table.uuid("id").primary();
		table.string("nome");

		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists("tipos_notificacaos");
}
