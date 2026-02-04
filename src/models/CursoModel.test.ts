import { describe, expect, it } from "vitest";
import { CursoModel } from "./index.js";
import { CursoDTO } from "../dto/index.js";

describe("CursoModel", () => {
	it("deve listar os cursos", async () => {
		const model = new CursoModel();
		const output = await model.list();
		expect(output).toBeInstanceOf(Array);
		expect(output.at(0)).toBeInstanceOf(CursoDTO);
	});
});
