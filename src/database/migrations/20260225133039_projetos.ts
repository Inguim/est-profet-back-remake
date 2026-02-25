import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable("projetos", (table) => {
		table.uuid("id").primary();
		table.string("nome", 100).unique();
		table.text("resumo");
		table.text("introducao");
		table.text("objetivo");
		table.text("metodologia");
		table.text("result_disc");
		table.text("conclusao");
		table
			.enu("status", ["aprovado", "analise", "alteracao"], {
				useNative: true,
				enumName: "projeto_status",
			})
			.notNullable()
			.defaultTo("analise");

		table.uuid("categoria_id").notNullable();
		table.uuid("estado_id").notNullable();

		table.foreign("categoria_id").references("id").inTable("categorias").onDelete("CASCADE").onUpdate("CASCADE");
		table.foreign("estado_id").references("id").inTable("estados").onDelete("CASCADE").onUpdate("CASCADE");

		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists("projetos");
	await knex.raw(`
		DROP TYPE IF EXISTS projeto_status;
	`);
}
