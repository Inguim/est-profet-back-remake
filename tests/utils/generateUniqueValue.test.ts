import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { generateUniqueValue } from "./generateUniqueValue.js";

describe("generateUniqueValue", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("deve gerar valor baseado no horário atual", () => {
		const mockDate = new Date(2024, 0, 1, 12, 34, 56, 789);
		vi.setSystemTime(mockDate);
		const output = generateUniqueValue();
		expect(output).toBe("123456789");
	});

	it("deve refletir mudança no tempo", () => {
		const date1 = new Date(2024, 0, 1, 1, 1, 1, 1);
		vi.setSystemTime(date1);
		const output1 = generateUniqueValue();
		const date2 = new Date(2024, 0, 1, 2, 2, 2, 2);
		vi.setSystemTime(date2);
		const output2 = generateUniqueValue();
		expect(output1).not.toBe(output2);
	});

	it("deve sempre retornar uma string", () => {
		const output = generateUniqueValue();
		expect(output).toBeTypeOf("string");
	});

	it("deve concatenar corretamente horas, minutos, segundos e ms", () => {
		const mockDate = new Date(2024, 0, 1, 3, 4, 5, 6);
		vi.setSystemTime(mockDate);
		const output = generateUniqueValue();
		expect(output).toBe("3456");
	});

	it("não garante tamanho fixo (sem padding)", () => {
		const mockDate = new Date(2024, 0, 1, 0, 0, 0, 1);
		vi.setSystemTime(mockDate);
		const output = generateUniqueValue();
		expect(output).toBe("0001"); // horas/min/seg = 0 → "0"
		expect(output.length).toBeLessThanOrEqual(7);
	});
});
