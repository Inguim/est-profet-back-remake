import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable("solicitacaos", (table) => {
		table.uuid("id").primary();
		table.string("titulo", 100);
		table.text("descricao");
		table.enum("status", ["aguardando", "alterado", "aprovado", "recusado"], {
			useNative: true,
			enumName: "solicitacaos_relacao",
		});
		table.uuid("deleted_id").nullable();

		table.uuid("creator_id").notNullable();
		table.uuid("projeto_id").notNullable();

		table.foreign("creator_id").references("id").inTable("usuarios").onDelete("SET NULL").onUpdate("CASCADE");
		table.foreign("projeto_id").references("id").inTable("projetos").onDelete("SET NULL").onUpdate("CASCADE");

		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists("solicitacaos");
	await knex.raw(`DROP TYPE IF EXISTS solicitacaos_relacao;`);
}
