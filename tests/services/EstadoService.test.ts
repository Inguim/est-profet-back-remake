import { describe, expect, it } from "vitest";
import { EstadoDTO } from "../../src/dto/index.js";
import { EstadoService } from "../../src/services/index.js";

describe("EstadoService", () => {
	const service = new EstadoService();

	it("deve retornar uma lista de estados", async () => {
		const output = await service.list();
		expect(output).toBeInstanceOf(Array);
		expect(output.at(0)).toBeInstanceOf(EstadoDTO);
	});
});
