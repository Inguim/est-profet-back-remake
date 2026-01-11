import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable("refresh_tokens", (table) => {
		table.uuid("id").primary();
		table.uuid("usuario_id").notNullable().references("usuarios.id");
		table.string("token", 255).notNullable().unique();
		table.timestamp("expires_at").notNullable();
		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists("refresh_tokens");
}
