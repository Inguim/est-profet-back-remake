import { describe, expect, it } from "vitest";
import { SerieDTO, type ISerieDTO } from "./index.js";

describe("SerieDTO", () => {
	it("deve conter as propriedades de ISerieDTO", () => {
		const output = new SerieDTO({ serie: "teste" });
		expect(output).toHaveProperty("id");
		expect(output).toHaveProperty("serie");
		expect(output).toHaveProperty("created_at");
		expect(output).toHaveProperty("updated_at");
	});

	it("deve preencher automaticamente os campos não parciais", () => {
		const output = new SerieDTO({ serie: "teste" });
		expect(output.id).toBeNull();
		expect(output.created_at).toBeUndefined();
		expect(output.updated_at).toBeUndefined();
	});

	it("deve preencher corretamente os campos", () => {
		const input: ISerieDTO = {
			id: "id123",
			serie: "teste",
			created_at: new Date(),
			updated_at: new Date(),
		};
		const output = new SerieDTO(input);
		expect(output).toEqual(input);
	});
});
