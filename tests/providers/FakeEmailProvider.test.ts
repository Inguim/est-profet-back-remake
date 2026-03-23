import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { FakeEmailProvider } from "../../src/providers/FakeEmailProvider.js";

describe("FakeEmailProvider", () => {
	let consoleSpy: any;

	const provider = new FakeEmailProvider();

	beforeEach(() => {
		consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("deve logar o email e o conteúdo corretamente", async () => {
		await provider.send("teste@email.com", "conteudo aqui");
		expect(consoleSpy).toHaveBeenCalledWith("E-mail enviado para: ", "teste@email.com");
		expect(consoleSpy).toHaveBeenCalledWith("Conteúdo do e-mail: ", "conteudo aqui");
	});

	it("deve chamar console.log duas vezes", async () => {
		const provider = new FakeEmailProvider();
		await provider.send("teste@email.com", "conteudo aqui");
		expect(consoleSpy).toHaveBeenCalledTimes(2);
	});
});
