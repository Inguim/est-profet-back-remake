import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable("usuario_projs", (table) => {
		table.uuid("id").primary();
		table.enu("relacao", ["coordenador", "coorientador", "orientador", "bolsista", "voluntario"], {
			useNative: true,
			enumName: "usuario_projs_relacao",
		});

		table.uuid("user_id").notNullable();
		table.uuid("projeto_id").notNullable();

		table.foreign("user_id").references("id").inTable("usuarios").onDelete("CASCADE").onUpdate("CASCADE");
		table.foreign("projeto_id").references("id").inTable("projetos").onDelete("CASCADE").onUpdate("CASCADE");

		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists("usuario_projs");
	await knex.raw(`
		DROP TYPE IF EXISTS usuario_projs_relacao;
	`);
}
