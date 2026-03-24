import { describe, it, expect } from "vitest";
import { z } from "zod";
import { formatErrorZod } from "../../src/utils/helpers/formatErrorZod.js";

describe("formatErrorZod", () => {
	it("deve mapear erros simples corretamente", () => {
		const schema = z.object({
			email: z.email(),
			password: z.string().min(6),
		});
		const output = schema.safeParse({
			email: "invalid-email",
			password: "123",
		});
		expect(output.success).toBe(false);
		if (!output.success) {
			const formatted = formatErrorZod(output.error);
			expect(formatted).toEqual({
				email: expect.any(String),
				password: expect.any(String),
			});
		}
	});

	it("deve usar apenas o primeiro nível do path", () => {
		const schema = z.object({
			user: z.object({
				name: z.string().min(3),
			}),
		});
		const output = schema.safeParse({
			user: { name: "a" },
		});
		expect(output.success).toBe(false);
		if (!output.success) {
			const formatted = formatErrorZod(output.error);
			// path será ['user', 'name'] → pega apenas 'user'
			expect(formatted).toEqual({
				user: expect.any(String),
			});
		}
	});

	it("deve usar 'unknown_field' quando path estiver vazio", () => {
		const schema = z.string().min(5);
		const output = schema.safeParse("abc");
		expect(output.success).toBe(false);
		if (!output.success) {
			const outputFormatted = formatErrorZod(output.error);
			expect(outputFormatted).toEqual({
				unknown_field: expect.any(String),
			});
		}
	});

	it("deve retornar objeto vazio quando não houver erros", () => {
		const input = {
			issues: [],
		} as any;
		const output = formatErrorZod(input);
		expect(output).toEqual({});
	});
});
