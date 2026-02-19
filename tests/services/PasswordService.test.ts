import { describe, expect, it } from "vitest";
import { PasswordService } from "../../src/services/PasswordService.js";
import { faker as f } from "@faker-js/faker";

const passwordService = new PasswordService();

describe("PasswordService", () => {
	it("deve gerar o hash de uma senha", async () => {
		const input = f.lorem.word({ length: { min: 8, max: 16 } });
		const output = await passwordService.hash(input);
		expect(output).not.toEqual(input);
	});

	it("deve retornar true para senhas iguais", async () => {
		const input = await passwordService.hash("senha");
		const output = await passwordService.compare("senha", input);
		expect(output).toBeTruthy();
	});

	it("deve retornar false para senhas diferentes", async () => {
		const input = await passwordService.hash("senha");
		const output = await passwordService.compare("senhA", input);
		expect(output).toBeFalsy();
	});
});
