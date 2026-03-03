import { describe, expect, it } from "vitest";
import { projetoValidator } from "../../src/validators/ProjetoValidator.js";
import { faker as f } from "@faker-js/faker";
import { formatErrorZod } from "../../src/utils/helpers/formatErrorZod.js";
import { PROJETO_STATUS_VALUES } from "../../src/dto/ProjetoDTO.js";

describe("UsuarioValidator", () => {
	describe("Create", () => {
		const validator = new projetoValidator.CreateValidator();

		it("deve requerir os campos obrigatórios", () => {
			const input = { tipo: "aluno" };
			const output = validator.validate(input);
			expect(output.success).toBe(false);
			const outputErrors = formatErrorZod(output.extra?.error as any);
			expect(outputErrors).toStrictEqual({
				nome: "O campo nome é obrigatório.",
				resumo: "O campo resumo é obrigatório.",
				introducao: "O campo introducao é obrigatório.",
				objetivo: "O campo objetivo é obrigatório.",
				metodologia: "O campo metodologia é obrigatório.",
				result_disc: "O campo result_disc é obrigatório.",
				conclusao: "O campo conclusao é obrigatório.",
				categoria_id: "O campo categoria_id é obrigatório.",
				estado_id: "O campo estado_id é obrigatório.",
				membros: "O campo membros é obrigatório.",
			});
		});

		it("deve requerir ao menos um MEMBRO em MEMBROS", () => {
			const input = { membros: [] };
			const output = validator.validate(input);
			expect(output.success).toBe(false);
			const outputErrors = formatErrorZod(output.extra?.error as any);
			expect(outputErrors).includes({
				membros: "O campo membros deve conter no minímo 1 valor informado",
			});
		});

		it("deve requerir validar ID como UUID em MEMBROS", () => {
			const input = { membros: [{ user_id: "asd1", relacao: "coordenador" }] };
			const output = validator.validate(input);
			expect(output.success).toBe(false);
			const outputErrors = formatErrorZod(output.extra?.error as any);
			expect(outputErrors).includes({
				membros: "O campo user_id deve ser um UUID.",
			});
		});

		it("deve requerir validar a RELACAO em MEMBROS", () => {
			const input = { membros: [{ user_id: "", relacao: "ajudante" }] };
			const output = validator.validate(input);
			expect(output.success).toBe(false);
			const outputErrors = formatErrorZod(output.extra?.error as any);
			expect(outputErrors).includes({
				membros:
					"O campo relacao deve ser um dos seguintes valores: coordenador, coorientador, orientador, bolsista, voluntario.",
			});
		});

		it("deve requerir apenas MEMBRO não repetido em MEMBROS", () => {
			const membro = { user_id: f.string.uuid(), relacao: "coordenador" };
			const input = { membros: [membro, membro] };
			const output = validator.validate(input);
			expect(output.success).toBe(false);
			const outputErrors = formatErrorZod(output.extra?.error as any);
			expect(outputErrors).includes({
				membros: "O campo membros deve conter apenas valores únicos",
			});
		});

		it("deve validar o tamanho mínimo dos campos", () => {
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
	});

	describe("Update", () => {
		const validator = new projetoValidator.UpdateValidator();

		it.each(PROJETO_STATUS_VALUES)("deve aceitar o status de projeto válido: %s", (status) => {
			const input = { status };
			const output = validator.validate(input);
			expect(output.success).toBeTruthy();
		});
	});
});
