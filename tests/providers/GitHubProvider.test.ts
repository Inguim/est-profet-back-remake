import { describe, expect, it } from "vitest";
import { GitHubProvider } from "../../src/providers/GitHubProvider.js";

describe("GitHubProvider", () => {
	const provider = new GitHubProvider();

	it("deve retornar NULL para um username inválido", async () => {
		const output = await provider.getUserInfo("não existe esse username");
		expect(output).toBeNull();
	});

	it("deve retornar as informações do github account para um username válido", async () => {
		const output = await provider.getUserInfo("inguim");
		expect(output).toMatchObject({
			username: expect.any(String),
			bio: expect.any(String),
			git: expect.any(String),
			cover_url: expect.any(String),
		});
	});
});
