import type { Knex } from "knex";
import { v4 as uuidV4 } from "uuid";

export async function seed(knex: Knex): Promise<void> {
	// Deletes ALL existing entries
	await knex("cursos").del();

	// Inserts seed entries
	await knex("cursos").insert([
		{ id: uuidV4(), curso: "Informática" },
		{ id: uuidV4(), curso: "Edificações" },
		{ id: uuidV4(), curso: "Mecatrônica" },
	]);
}
