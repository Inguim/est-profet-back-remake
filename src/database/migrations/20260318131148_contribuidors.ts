import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable("contribuidors", (table) => {
		table.uuid("id").primary();
		table.string("github_username").nullable();

		table.uuid("tipo_contribuicao_id").notNullable();
		table.uuid("user_id").notNullable();

		table
			.foreign("tipo_contribuicao_id")
			.references("id")
			.inTable("tipo_contribuicaos")
			.onUpdate("CASCADE")
			.onDelete("CASCADE");
		table.foreign("user_id").references("id").inTable("usuarios").onUpdate("CASCADE").onDelete("CASCADE");

		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists("contribuidors");
}
