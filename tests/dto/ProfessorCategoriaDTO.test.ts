import { describe, expect, it } from "vitest";
import { ProfessorCategoriaDTO, type IProfessorCategoriaDTO } from "../../src/dto/index.js";

describe("ProfessorCategoriaDTO", () => {
	it("deve conter as propriedades de IProfessorCategoriaDTO", () => {
		const output = new ProfessorCategoriaDTO({
			professor_id: "13123",
			categoria_id: "12312",
		});
		expect(output).toHaveProperty("id");
		expect(output).toHaveProperty("professor_id");
		expect(output).toHaveProperty("categoria_id");
		expect(output).toHaveProperty("created_at");
		expect(output).toHaveProperty("updated_at");
	});

	it("deve preencher automaticamente os campos não parciais", () => {
		const output = new ProfessorCategoriaDTO({
			professor_id: "13123",
			categoria_id: "12312",
		});
		expect(output.id).toBeNull();
		expect(output.created_at).toBeUndefined();
		expect(output.updated_at).toBeUndefined();
	});

	it("deve preencher corretamente os campos", () => {
		const input: IProfessorCategoriaDTO = {
			id: "123123",
			professor_id: "13123",
			categoria_id: "12312",
			created_at: new Date(),
			updated_at: new Date(),
		};
		const output = new ProfessorCategoriaDTO(input);
		expect(output).toEqual(input);
	});
});
