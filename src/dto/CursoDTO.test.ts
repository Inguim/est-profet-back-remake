import { describe, expect, it } from "vitest";
import { CursoDTO } from "./index.js";

describe("CursoDTO", () => {
	it("deve conter as propriedades de ICursoDTO", () => {
		const output = new CursoDTO();
		expect(output).toHaveProperty("curso");
	});

	it("deve preencher automaticamente os campos não parciais", () => {
		const output = new CursoDTO();
		expect(output.created_at).toBeInstanceOf(Date);
		expect(output.updated_at).toBeInstanceOf(Date);
	});
});
