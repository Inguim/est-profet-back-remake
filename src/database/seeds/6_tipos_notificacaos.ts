import type { Knex } from "knex";
import { v4 as uuidV4 } from "uuid";
// @ts-expect-error Apenas para permitir importar via Knex
import { TIPOS_NOTIFICACAO } from "../../utils/constants/tipos-notificacao.ts";

export async function seed(knex: Knex): Promise<void> {
	await knex("tipos_notificacaos").del();

	await knex("tipos_notificacaos").insert(
		Object.values(TIPOS_NOTIFICACAO).map((value) => {
			return { id: uuidV4(), nome: value };
		}),
	);
}
