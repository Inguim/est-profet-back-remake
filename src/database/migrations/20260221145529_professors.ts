import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable("professors", (table) => {
		table.uuid("id").primary();

		table.uuid("user_id").notNullable();

		table.foreign("user_id").references("id").inTable("usuarios").onDelete("CASCADE").onUpdate("CASCADE");

		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists("professors");
}
