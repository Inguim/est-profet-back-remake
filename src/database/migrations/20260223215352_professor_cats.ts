import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable("professor_cats", (table) => {
		table.uuid("id").primary();

		table.uuid("professor_id").notNullable();
		table.uuid("categoria_id").notNullable();

		table.foreign("professor_id").references("id").inTable("professors").onDelete("CASCADE").onUpdate("CASCADE");
		table.foreign("categoria_id").references("id").inTable("categorias").onDelete("CASCADE").onUpdate("CASCADE");

		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists("professor_cats");
}
