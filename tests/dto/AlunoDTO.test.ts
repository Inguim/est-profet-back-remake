import { describe, expect, it } from "vitest";
import { AlunoDTO, type IAlunoDTO } from "../../src/dto/index.js";

describe("AlunoDTO", () => {
	it("deve conter as propriedades de IAlunoDTO", () => {
		const output = new AlunoDTO({ user_id: "a1", curso_id: "a2", serie_id: "a3" });
		expect(output).toHaveProperty("id");
		expect(output).toHaveProperty("user_id");
		expect(output).toHaveProperty("curso_id");
		expect(output).toHaveProperty("serie_id");
		expect(output).toHaveProperty("created_at");
		expect(output).toHaveProperty("updated_at");
	});

	it("deve preencher automaticamente os campos não parciais", () => {
		const output = new AlunoDTO({ user_id: "a1", curso_id: "a2", serie_id: "a3" });
		expect(output.id).toBeNull();
		expect(output.created_at).toBeUndefined();
		expect(output.updated_at).toBeUndefined();
	});

	it("deve preencher corretamente os campos", () => {
		const input: IAlunoDTO = {
			id: "id123",
			user_id: "a1",
			curso_id: "a2",
			serie_id: "a3",
			created_at: new Date(),
			updated_at: new Date(),
		};
		const output = new AlunoDTO(input);
		expect(output).toEqual(input);
	});
});
