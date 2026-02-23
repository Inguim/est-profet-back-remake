import { describe, expect, it } from "vitest";
import { SerieDTO } from "../../src/dto/index.js";
import { SerieService } from "../../src/services/index.js";

describe("SerieService", () => {
	const service = new SerieService();

	it("deve retornar uma lista de series", async () => {
		const output = await service.list();
		expect(output).toBeInstanceOf(Array);
		expect(output.at(0)).toBeInstanceOf(SerieDTO);
	});

	it("deve encontrar uma serie pelo ID", async () => {
		const input = (await service.list()).at(0);
		const output = await service.get(String(input?.id));
		expect(String(output.id)).toBeDefined();
	});
});
