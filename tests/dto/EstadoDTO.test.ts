import { describe, expect, it } from "vitest";
import { EstadoDTO, type IEstadoDTO } from "../../src/dto/index.js";

describe("EstadoDTO", () => {
	it("deve conter as propriedades de IEstadoDTO", () => {
		const output = new EstadoDTO({ estado: "teste" });
		expect(output).toHaveProperty("id");
		expect(output).toHaveProperty("estado");
		expect(output).toHaveProperty("created_at");
		expect(output).toHaveProperty("updated_at");
	});

	it("deve preencher automaticamente os campos não parciais", () => {
		const output = new EstadoDTO({ estado: "teste" });
		expect(output.id).toBeNull();
		expect(output.created_at).toBeUndefined();
		expect(output.updated_at).toBeUndefined();
	});

	it("deve preencher corretamente os campos", () => {
		const input: IEstadoDTO = {
			id: "id123",
			estado: "teste",
			created_at: new Date(),
			updated_at: new Date(),
		};
		const output = new EstadoDTO(input);
		expect(output).toEqual(input);
	});
});
