import type { Knex } from "knex";
import { v4 as uuidV4 } from "uuid";

export async function seed(knex: Knex): Promise<void> {
	await knex("tipos_notificacaos").del();

	await knex("tipos_notificacaos").insert([{ id: uuidV4(), nome: "solicitacao" }]);
}
