import { describe, expect, it } from "vitest";
import { SerieModel } from "../../src/models/index.js";
import { SerieDTO } from "../../src/dto/index.js";

describe("SerieModel", () => {
	it("deve listar as series", async () => {
		const model = new SerieModel();
		const output = await model.list();
		expect(output).toBeInstanceOf(Array);
		expect(output.at(0)).toBeInstanceOf(SerieDTO);
	});

	it("deve trazer apenas as propriedades id e serie", async () => {
		const model = new SerieModel();
		const output = (await model.list()).at(0);
		expect(output?.id).not.toBeNull();
		expect(output?.serie).not.toEqual("");
		expect(output?.created_at).toBeUndefined();
		expect(output?.updated_at).toBeUndefined();
	});
});
