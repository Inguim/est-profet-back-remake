import { describe, expect, it } from "vitest";
import { CursoModel } from "../../src/models/index.js";
import { CursoDTO } from "../../src/dto/index.js";

describe("CursoModel", () => {
	it("deve listar os cursos", async () => {
		const model = new CursoModel();
		const output = await model.list();
		expect(output).toBeInstanceOf(Array);
		expect(output.at(0)).toBeInstanceOf(CursoDTO);
	});
});
