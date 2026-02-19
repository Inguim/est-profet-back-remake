import { describe, expect, it } from "vitest";
import type { IBaseDTO } from "../../src/dto/index.js";

describe("BaseDTO", () => {
	class TestDTO implements IBaseDTO {
		id: string = "";
		created_at: Date = new Date();
		updated_at: Date = new Date();
		campoAleatorio: string = "test";
	}

	it("deve conter as propriedades de IBaseDTO", () => {
		const input = new TestDTO();
		expect(input).toHaveProperty("id");
		expect(input).toHaveProperty("created_at");
		expect(input).toHaveProperty("updated_at");
	});

	it("deve conter as propriedades adicionais da classe derivada", () => {
		const input = new TestDTO();
		expect(input).toHaveProperty("campoAleatorio");
	});

	it("as propriedades de IBaseDTO devem ter os tipos corretos", () => {
		const input = new TestDTO();
		expect(typeof input.id).toBe("string");
		expect(input.created_at).toBeInstanceOf(Date);
		expect(input.updated_at).toBeInstanceOf(Date);
	});
});
