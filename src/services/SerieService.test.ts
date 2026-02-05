import { describe, expect, it } from "vitest";
import { SerieDTO } from "../dto/index.js";
import { SerieService } from "./index.js";

describe("SerieService", () => {
	const service = new SerieService();

	it("deve listar as series", async () => {
		const output = await service.list();
		expect(output).toBeInstanceOf(Array);
		expect(output.at(0)).toBeInstanceOf(SerieDTO);
	});
});
