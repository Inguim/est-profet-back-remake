import { describe, expect, it } from "vitest";
import { TipoContribuicaoService } from "../../src/services/index.js";
import { TipoContribuicaoDTO } from "../../src/dto/index.js";

describe("TipoContribuicaoService", () => {
	it("deve retornar um tipo de contribuição pelo NOME", async () => {
		const service = new TipoContribuicaoService();
		const output = await service.get("desenvolvedor");
		expect(output).toBeInstanceOf(TipoContribuicaoDTO);
		expect(output?.id).toBeDefined();
	});

	it("deve retornar uma lista de tipos de contribuição", async () => {
		const service = new TipoContribuicaoService();
		const output = await service.list();
		expect(output).toBeInstanceOf(Array);
		expect(output.at(0)).toBeInstanceOf(TipoContribuicaoDTO);
	});
});
