import { describe, expect, it } from "vitest";
import { CursoDTO } from "../../src/dto/index.js";
import { CursoService } from "../../src/services/index.js";

describe("CursoService", () => {
	const service = new CursoService();

	it("deve retornar uma lista de cursos", async () => {
		const output = await service.list();
		expect(output).toBeInstanceOf(Array);
		expect(output.at(0)).toBeInstanceOf(CursoDTO);
	});

	it("deve encontrar um curso pelo ID", async () => {
		const input = (await service.list()).at(0);
		const output = await service.get(String(input?.id));
		expect(String(output.id)).toBeDefined();
	});
});
