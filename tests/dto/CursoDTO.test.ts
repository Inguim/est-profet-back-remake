import { describe, expect, it } from "vitest";
import { CursoDTO, type ICursoDTO } from "../../src/dto/index.js";

describe("CursoDTO", () => {
	it("deve conter as propriedades de ICursoDTO", () => {
		const output = new CursoDTO({ curso: "teste" });
		expect(output).toHaveProperty("id");
		expect(output).toHaveProperty("curso");
		expect(output).toHaveProperty("created_at");
		expect(output).toHaveProperty("updated_at");
	});

	it("deve preencher automaticamente os campos não parciais", () => {
		const output = new CursoDTO({ curso: "teste" });
		expect(output.id).toBeNull();
		expect(output.created_at).toBeUndefined();
		expect(output.updated_at).toBeUndefined();
	});

	it("deve preencher corretamente os campos", () => {
		const input: ICursoDTO = {
			id: "id123",
			curso: "teste",
			created_at: new Date(),
			updated_at: new Date(),
		};
		const output = new CursoDTO(input);
		expect(output).toEqual(input);
	});
});
