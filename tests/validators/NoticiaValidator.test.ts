import { describe, expect, it } from "vitest";
import { noticiaValidator } from "../../src/validators/NoticiaValidator.js";
import { formatErrorZod } from "../../src/utils/helpers/formatErrorZod.js";
import { faker as f } from "@faker-js/faker";

describe("NoticiaValidator", () => {
	describe("Create", () => {
		const validator = new noticiaValidator.CreateValidator();

		it("deve requerir os campos obrigatórios ", () => {
			const input = {};
			const output = validator.validate(input);
			expect(output.success).toBe(false);
			const outputErrors = formatErrorZod(output.extra?.error as any);
			expect(outputErrors).toStrictEqual({
				nome: "O campo nome é obrigatório.",
				link: "O campo link é obrigatório.",
			});
		});

		it("deve validar o tamanho mínimo do 'nome'", () => {
			const input = {
				nome: "jo",
			};
			const output = validator.validate(input);
			expect(output.success).toBe(false);
			const outputErrors = formatErrorZod(output.extra?.error as any);
			expect(outputErrors).includes({
				nome: "O campo nome deve ter no mínimo 3 caracteres.",
			});
		});

		it("deve validar o tamanho mínimo do 'link'", () => {
			const input = {
				link: "jo",
			};
			const output = validator.validate(input);
			expect(output.success).toBe(false);
			const outputErrors = formatErrorZod(output.extra?.error as any);
			expect(outputErrors).includes({
				link: "O campo link deve ter no mínimo 3 caracteres.",
			});
		});

		it("deve validar o tamanho máximo do 'nome'", () => {
			const input = { nome: f.string.alpha(51) };
			const output = validator.validate(input);
			expect(output.success).toBe(false);
			const outputErrors = formatErrorZod(output.extra?.error as any);
			expect(outputErrors).includes({
				nome: "O campo nome deve ter no máximo 50 caracteres.",
			});
		});

		it("deve validar o tamanho máximo do 'link'", () => {
			const input = { link: f.string.alpha(256) };
			const output = validator.validate(input);
			expect(output.success).toBe(false);
			const outputErrors = formatErrorZod(output.extra?.error as any);
			expect(outputErrors).includes({
				link: "O campo link deve ter no máximo 255 caracteres.",
			});
		});
	});

	describe("Update", () => {
		const validator = new noticiaValidator.UpdateValidator();

		it("deve requerir os campos obrigatórios ", () => {
			const input = {};
			const output = validator.validate(input);
			expect(output.success).toBe(false);
			const outputErrors = formatErrorZod(output.extra?.error as any);
			expect(outputErrors).toStrictEqual({
				nome: "O campo nome é obrigatório.",
				link: "O campo link é obrigatório.",
			});
		});

		it("deve validar o tamanho mínimo do 'nome'", () => {
			const input = {
				nome: "jo",
			};
			const output = validator.validate(input);
			expect(output.success).toBe(false);
			const outputErrors = formatErrorZod(output.extra?.error as any);
			expect(outputErrors).includes({
				nome: "O campo nome deve ter no mínimo 3 caracteres.",
			});
		});

		it("deve validar o tamanho mínimo do 'link'", () => {
			const input = {
				link: "jo",
			};
			const output = validator.validate(input);
			expect(output.success).toBe(false);
			const outputErrors = formatErrorZod(output.extra?.error as any);
			expect(outputErrors).includes({
				link: "O campo link deve ter no mínimo 3 caracteres.",
			});
		});

		it("deve validar o tamanho máximo do 'nome'", () => {
			const input = { nome: f.string.alpha(51) };
			const output = validator.validate(input);
			expect(output.success).toBe(false);
			const outputErrors = formatErrorZod(output.extra?.error as any);
			expect(outputErrors).includes({
				nome: "O campo nome deve ter no máximo 50 caracteres.",
			});
		});

		it("deve validar o tamanho máximo do 'link'", () => {
			const input = { link: f.string.alpha(256) };
			const output = validator.validate(input);
			expect(output.success).toBe(false);
			const outputErrors = formatErrorZod(output.extra?.error as any);
			expect(outputErrors).includes({
				link: "O campo link deve ter no máximo 255 caracteres.",
			});
		});
	});
});
