import { describe, expect, it } from "vitest";
import { CursoModel } from "../../src/models/index.js";
import { CursoDTO } from "../../src/dto/index.js";

describe("CursoModel", () => {
	it("deve retornar uma lista de cursos", async () => {
		const model = new CursoModel();
		const output = await model.list();
		expect(output).toBeInstanceOf(Array);
		expect(output.at(0)).toBeInstanceOf(CursoDTO);
	});

	it("deve encontrar um curso pelo ID", async () => {
		const model = new CursoModel();
		const input = (await model.list()).at(0);
		const output = await model.get(String(input?.id));
		expect(output).toBeInstanceOf(CursoDTO);
		expect(output?.id).toBeDefined();
	});
});
