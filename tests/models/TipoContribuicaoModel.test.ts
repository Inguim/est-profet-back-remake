import { describe, expect, it } from "vitest";
import { TipoContribuicaoModel } from "../../src/models/index.js";
import { TipoContribuicaoDTO } from "../../src/dto/index.js";

describe("TipoContribuicaoModel", () => {
	it("deve encontrar um tipo de contribuição pelo NOME", async () => {
		const model = new TipoContribuicaoModel();
		const output = await model.get("apoio_manutencao");
		expect(output).toBeInstanceOf(TipoContribuicaoDTO);
		expect(output?.id).toBeDefined();
	});

	it("deve retornar uma lista de TipoContribuicaoDTO", async () => {
		const model = new TipoContribuicaoModel();
		const output = await model.list();
		expect(output).toBeInstanceOf(Array);
		expect(output.at(0)).toBeInstanceOf(TipoContribuicaoDTO);
	});
});
