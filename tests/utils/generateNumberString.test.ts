import { describe, expect, it } from "vitest";
import { generateNumberString } from "../../src/utils/helpers/generateNumberString.js";

describe("generateNumberString", () => {
	it("deve retornar uma string", () => {
		const code = generateNumberString();
		expect(typeof code).toBe("string");
	});

	it("deve sempre retornar 6 caracteres", () => {
		const code = generateNumberString();
		expect(code).toHaveLength(6);
	});

	it("deve contér apenas caracteres numéricos", () => {
		const code = generateNumberString();
		expect(code).toMatch(/^\d{6}$/);
	});

	it("deve gerar códigos diferentes em múltiplas chamadas", () => {
		const codes = new Set();
		for (let i = 0; i < 100; i++) {
			codes.add(generateNumberString());
		}
		expect(codes.size).toBeGreaterThan(1);
	});
});
