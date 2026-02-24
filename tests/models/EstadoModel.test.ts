import { describe, expect, it } from "vitest";
import { EstadoModel } from "../../src/models/index.js";
import { EstadoDTO } from "../../src/dto/index.js";

describe("EstadoModel", () => {
	it("deve retornar uma lista de estados", async () => {
		const model = new EstadoModel();
		const output = await model.list();
		expect(output).toBeInstanceOf(Array);
		expect(output.at(0)).toBeInstanceOf(EstadoDTO);
	});
});
