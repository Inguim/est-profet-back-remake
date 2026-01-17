import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable("usuarios", (table) => {
		table.uuid("id").primary();
		table.string("nome", 255).notNullable();
		table.string("email", 255).notNullable().unique();
		table
			.enu("tipo", ["aluno", "professor"], {
				useNative: true,
				enumName: "user_tipo",
			})
			.notNullable();
		table.boolean("admin").notNullable().defaultTo(false);
		table
			.enu("status", ["aprovado", "analise"], {
				useNative: true,
				enumName: "user_status",
			})
			.notNullable()
			.defaultTo("analise");
		table.string("password", 255).notNullable();
		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists("usuarios");

	await knex.raw(`
		DROP TYPE IF EXISTS user_status;
	`);
	await knex.raw(`
		DROP TYPE IF EXISTS user_tipo;
	`);
}
