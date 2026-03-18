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
});
