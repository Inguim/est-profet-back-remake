import type { Knex } from "knex";
import { v4 as uuidV4 } from "uuid";

export async function seed(knex: Knex): Promise<void> {
	// Deletes ALL existing entries
	await knex("series").del();

	// Inserts seed entries
	await knex("series").insert([
		{ id: uuidV4(), serie: 1 },
		{ id: uuidV4(), serie: 2 },
		{ id: uuidV4(), serie: 3 },
	]);
}
