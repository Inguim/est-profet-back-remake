import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable("notificacaos", (table) => {
		table.uuid("id").primary();
		table.boolean("visto").defaultTo(false);

		table.uuid("tipo_id").notNullable();
		table.uuid("solicitacao_id").notNullable();
		table.uuid("user_id").notNullable();

		table.foreign("tipo_id").references("id").inTable("tipos_notificacaos").onUpdate("CASCADE");
		table.foreign("solicitacao_id").references("id").inTable("solicitacaos").onUpdate("CASCADE").onDelete("CASCADE");
		table.foreign("user_id").references("id").inTable("usuarios").onUpdate("CASCADE").onDelete("CASCADE");

		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists("notificacaos");
}
