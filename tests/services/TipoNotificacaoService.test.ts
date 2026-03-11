import { describe, expect, it } from "vitest";
import { TipoNotificacaoService } from "../../src/services/index.js";
import { TipoNotificacaoDTO } from "../../src/dto/index.js";

describe("TipoNotificacaoService", () => {
	it("deve retornar um tipo de notificação pelo NOME", async () => {
		const service = new TipoNotificacaoService();
		const output = await service.get("solicitacao");
		expect(output).toBeInstanceOf(TipoNotificacaoDTO);
		expect(output?.id).toBeDefined();
	});
});
