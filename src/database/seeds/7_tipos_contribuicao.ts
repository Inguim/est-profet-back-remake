import type { Knex } from "knex";
import { v4 as uuidV4 } from "uuid";
// @ts-expect-error pra suprimir erro durante execução de Knex
import { TIPOS_CONTRUIBUICAO } from "../../utils/constants/tipos-contribuicao.ts";

export async function seed(knex: Knex): Promise<void> {
	await knex("tipo_contribuicaos").del();

	await knex("tipo_contribuicaos").insert(
		Object.values(TIPOS_CONTRUIBUICAO).map((value) => {
			return { id: uuidV4(), nome: value };
		}),
	);
}
