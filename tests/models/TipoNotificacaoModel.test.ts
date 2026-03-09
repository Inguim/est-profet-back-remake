import { describe, expect, it } from "vitest";
import { TipoNotificacaoModel } from "../../src/models/index.js";
import { TipoNotificacaoDTO } from "../../src/dto/index.js";

describe("TipoNotificacaoModel", () => {
	it("deve encontrar um tipo de notificação pelo NOME", async () => {
		const model = new TipoNotificacaoModel();
		const output = await model.get("solicitacao");
		expect(output).toBeInstanceOf(TipoNotificacaoDTO);
		expect(output?.id).toBeDefined();
	});
});
