import { beforeAll, describe, expect, it } from "vitest";
import { EstadoDTO } from "../../src/dto/index.js";
import { EstadoService } from "../../src/services/index.js";

describe("EstadoService", () => {
	let estado: EstadoDTO;
	const service = new EstadoService();

	beforeAll(async () => {
		estado = (await service.list()).at(0) as EstadoDTO;
	});

	it("deve retornar uma lista de estados", async () => {
		const output = await service.list();
		expect(output).toBeInstanceOf(Array);
		expect(output.at(0)).toBeInstanceOf(EstadoDTO);
	});

	it("deve permitir filtrar por ID", async () => {
		const input = String(estado?.id);
		const output = await service.list();
		const outputFiltred = await service.list({ id: [input] });
		expect(output.length).not.toEqual(outputFiltred.length);
	});
});
