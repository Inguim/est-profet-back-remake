import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable("alunos", (table) => {
		table.uuid("id").primary();

		table.uuid("user_id").notNullable();
		table.uuid("curso_id").notNullable();
		table.uuid("serie_id").notNullable();

		table.foreign("user_id").references("id").inTable("usuarios").onDelete("CASCADE").onUpdate("CASCADE");
		table.foreign("curso_id").references("id").inTable("cursos").onDelete("CASCADE").onUpdate("CASCADE");
		table.foreign("serie_id").references("id").inTable("series").onDelete("CASCADE").onUpdate("CASCADE");

		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists("alunos");
}
