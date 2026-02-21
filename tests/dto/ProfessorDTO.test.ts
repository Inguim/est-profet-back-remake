import { describe, expect, it } from "vitest";
import { ProfessorDTO, type IProfessorDTO } from "../../src/dto/index.js";

describe("ProfessorDTO", () => {
	it("deve conter as propriedades de IProfessorDTO", () => {
		const output = new ProfessorDTO({ user_id: "a1" });
		expect(output).toHaveProperty("id");
		expect(output).toHaveProperty("user_id");
		expect(output).toHaveProperty("created_at");
		expect(output).toHaveProperty("updated_at");
	});

	it("deve preencher automaticamente os campos não parciais", () => {
		const output = new ProfessorDTO({ user_id: "a1" });
		expect(output.id).toBeNull();
		expect(output.created_at).toBeUndefined();
		expect(output.updated_at).toBeUndefined();
	});

	it("deve preencher corretamente os campos", () => {
		const input: IProfessorDTO = {
			id: "id123",
			user_id: "a1",
			created_at: new Date(),
			updated_at: new Date(),
		};
		const output = new ProfessorDTO(input);
		expect(output).toEqual(input);
	});
});
