import { describe, expect, it } from "vitest";
import { CursoDTO } from "../dto/index.js";
import { CursoService } from "./index.js";

describe("CursoService", () => {
	const service = new CursoService();

	it("deve listar cursos", async () => {
		const output = await service.list();
		expect(output).toBeInstanceOf(Array);
		expect(output.at(0)).toBeInstanceOf(CursoDTO);
	});
});
