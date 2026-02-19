import { describe, expect, it } from "vitest";
import { CursoDTO } from "../../src/dto/index.js";
import { CursoService } from "../../src/services/index.js";

describe("CursoService", () => {
	const service = new CursoService();

	it("deve listar cursos", async () => {
		const output = await service.list();
		expect(output).toBeInstanceOf(Array);
		expect(output.at(0)).toBeInstanceOf(CursoDTO);
	});
});
