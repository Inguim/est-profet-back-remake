import { describe, expect, it } from "vitest";
import { userValidator } from "./UsuarioValidator.js";
import { formatErrorZod } from "../utils/helpers/formatErrorZod.js";
import { faker as f } from "@faker-js/faker";
import { USUARIO_TIPOS } from "../dto/index.js";

describe("UsuarioValidator", () => {
	const TIPOS = [...USUARIO_TIPOS];

	describe("CreateValidator", () => {
		const validator = new userValidator.CreateValidator();

		it("deve requerir os campos obrigatórios", () => {
			const input = {};
			const output = validator.validate(input);
			expect(output.success).toBe(false);
			const outputErrors = formatErrorZod(output.extra?.error as any);
			expect(outputErrors).toStrictEqual({
				nome: "O campo nome é obrigatório.",
				email: "Por favor, insira um e-mail válido.",
				password: "O campo password é obrigatório.",
				confirm_password: "O campo confirm_password é obrigatório.",
				tipo: "O campo tipo deve ser um dos seguintes valores: aluno, professor.",
			});
		});

		it("deve validar o tamanho mínimo dos campos", () => {
			const input = {
				nome: "jo",
				password: "12345",
				confirm_password: "12345",
			};
			const output = validator.validate(input);
			expect(output.success).toBe(false);
			const outputErrors = formatErrorZod(output.extra?.error as any);
			expect(outputErrors).includes({
				nome: "O campo nome deve ter no mínimo 3 caracteres.",
				password: "O campo password deve ter no mínimo 6 caracteres.",
				confirm_password: "O campo confirm_password deve ter no mínimo 6 caracteres.",
			});
		});

		it("deve validar o formato do e-mail", () => {
			const input = {
				email: "invalid-email",
			};
			const output = validator.validate(input);
			expect(output.success).toBe(false);
			const outputErrors = formatErrorZod(output.extra?.error as any);
			expect(outputErrors).includes({
				email: "Por favor, insira um e-mail válido.",
			});
		});

		it("deve validar a confirmação de senha", () => {
			const input = {
				nome: f.person.firstName(),
				email: f.internet.email(),
				tipo: "aluno",
				password: "123456",
				confirm_password: "1234567",
			};
			const output = validator.validate(input);
			expect(output.success).toBe(false);
			const outputErrors = formatErrorZod(output.extra?.error as any);
			expect(outputErrors).includes({
				confirm_password: "As senhas não coincidem.",
			});
		});

		it.each(TIPOS)("deve aceitar o tipo de usuário válido: %s", (tipo) => {
			const input = { tipo };
			const output = validator.validate(input);
			expect(output.success).toBe(false);
			const outputErrors = formatErrorZod(output.extra?.error as any);
			expect(outputErrors).not.toHaveProperty("tipo");
		});

		it("deve recusar um tipo de usuário inválido", () => {
			const input = { tipo: "invalido" };
			const output = validator.validate(input);
			expect(output.success).toBe(false);
			const outputErrors = formatErrorZod(output.extra?.error as any);
			expect(outputErrors).includes({
				tipo: "O campo tipo deve ser um dos seguintes valores: aluno, professor.",
			});
		});
	});
});
