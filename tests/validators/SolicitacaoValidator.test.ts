import { describe, expect, it } from "vitest";
import { solicitacaoValidator } from "../../src/validators/index.js";
import { formatErrorZod } from "../../src/utils/helpers/formatErrorZod.js";

describe("SolicitacaoValidator", () => {
	describe("Create", () => {
		const validator = new solicitacaoValidator.CreateValidator();

		it("deve requerir os campos obrigatórios", () => {
			const input = {};
			const output = validator.validate(input);
			expect(output.success).toBe(false);
			const outputErrors = formatErrorZod(output.extra?.error as any);
			expect(outputErrors).toStrictEqual({
				titulo: "O campo titulo é obrigatório.",
				descricao: "O campo descricao é obrigatório.",
				projeto_id: "O campo projeto_id deve ser um UUID.",
			});
		});
	});
});
