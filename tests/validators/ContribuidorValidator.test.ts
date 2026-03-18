import { describe, expect, it } from "vitest";
import { contribuidorValidator } from "../../src/validators/ContribuidorValidator.js";
import { formatErrorZod } from "../../src/utils/helpers/formatErrorZod.js";

describe("ContribuidorValidator", () => {
	describe("Create", () => {
		const validator = new contribuidorValidator.CreateValidator();

		it("deve requerir os campos obrigatórios ", () => {
			const input = {};
			const output = validator.validate(input);
			expect(output.success).toBe(false);
			const outputErrors = formatErrorZod(output.extra?.error as any);
			expect(outputErrors).toStrictEqual({
				github_username: "O campo github_username é obrigatório.",
				tipo_contribuicao_id: "O campo tipo_contribuicao_id deve ser um UUID.",
				user_id: "O campo user_id deve ser um UUID.",
			});
		});

		it("deve validar o tamanho mínimo do 'github_username'", () => {
			const input = {
				github_username: "jo",
			};
			const output = validator.validate(input);
			expect(output.success).toBe(false);
			const outputErrors = formatErrorZod(output.extra?.error as any);
			expect(outputErrors).includes({
				github_username: "O campo github_username deve ter no mínimo 3 caracteres.",
			});
		});

		it("deve requerir validar ID como UUID em 'tipo_contribuicao_id'", () => {
			const input = { tipo_contribuicao_id: "te" };
			const output = validator.validate(input);
			expect(output.success).toBe(false);
			const outputErrors = formatErrorZod(output.extra?.error as any);
			expect(outputErrors).includes({
				tipo_contribuicao_id: "O campo tipo_contribuicao_id deve ser um UUID.",
			});
		});

		it("deve requerir validar ID como UUID em 'user_id'", () => {
			const input = { user_id: "teste" };
			const output = validator.validate(input);
			expect(output.success).toBe(false);
			const outputErrors = formatErrorZod(output.extra?.error as any);
			expect(outputErrors).includes({
				user_id: "O campo user_id deve ser um UUID.",
			});
		});
	});

	describe("Update", () => {
		const validator = new contribuidorValidator.UpdateValidator();

		it("deve requerir os campos obrigatórios ", () => {
			const input = {};
			const output = validator.validate(input);
			expect(output.success).toBe(false);
			const outputErrors = formatErrorZod(output.extra?.error as any);
			expect(outputErrors).toStrictEqual({
				github_username: "O campo github_username é obrigatório.",
				tipo_contribuicao_id: "O campo tipo_contribuicao_id deve ser um UUID.",
			});
		});

		it("deve validar o tamanho mínimo do 'github_username'", () => {
			const input = {
				github_username: "jo",
			};
			const output = validator.validate(input);
			expect(output.success).toBe(false);
			const outputErrors = formatErrorZod(output.extra?.error as any);
			expect(outputErrors).includes({
				github_username: "O campo github_username deve ter no mínimo 3 caracteres.",
			});
		});

		it("deve requerir validar ID como UUID em 'tipo_contribuicao_id'", () => {
			const input = { tipo_contribuicao_id: "te" };
			const output = validator.validate(input);
			expect(output.success).toBe(false);
			const outputErrors = formatErrorZod(output.extra?.error as any);
			expect(outputErrors).includes({
				tipo_contribuicao_id: "O campo tipo_contribuicao_id deve ser um UUID.",
			});
		});
	});
});
