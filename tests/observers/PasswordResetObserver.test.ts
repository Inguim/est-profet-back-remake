import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { FakeEmailProvider } from "../../src/providers/FakeEmailProvider.js";
import { PasswordResetObserver } from "../../src/observers/PasswordResetObserver.js";

describe("PasswordResetObserver com FakeEmailProvider", () => {
	let consoleSpy: any;

	beforeEach(() => {
		consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("deve enviar email (via console.log) com o token corretamente", async () => {
		const emailProvider = new FakeEmailProvider();
		const observer = new PasswordResetObserver({
			emailProvider,
		});
		await observer.created("teste@email.com", "123456");
		expect(consoleSpy).toHaveBeenCalledTimes(2);
		expect(consoleSpy).toHaveBeenCalledWith("E-mail enviado para: ", "teste@email.com");
		expect(consoleSpy).toHaveBeenCalledWith("Conteúdo do e-mail: ", "Token de confirmação: 123456");
	});
});
