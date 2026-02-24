import type { Knex } from "knex";
import { v4 as uuidV4 } from "uuid";

export async function seed(knex: Knex): Promise<void> {
	await knex("estados").del();

	await knex("estados").insert([
		{ id: uuidV4(), estado: "Concluído" },
		{ id: uuidV4(), estado: "Em andamento" },
		{ id: uuidV4(), estado: "A procura de orientador" },
	]);
}
