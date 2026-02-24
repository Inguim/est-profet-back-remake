import { describe, expect, it } from "vitest";
import { userValidator } from "../../src/validators/UsuarioValidator.js";
import { formatErrorZod } from "../../src//utils/helpers/formatErrorZod.js";
import { faker as f } from "@faker-js/faker";
import { USUARIO_TIPOS } from "../../src//dto/index.js";

describe("UsuarioValidator", () => {
	const TIPOS = [...USUARIO_TIPOS];

	describe("Create", () => {
		const validator = new userValidator.CreateValidator();

		it("deve requerir o campo 'tipo'", () => {
			const input = {};
			const output = validator.validate(input);
			expect(output.success).toBe(false);
			const outputErrors = formatErrorZod(output.extra?.error as any);
			expect(outputErrors).includes({
				tipo: "O campo tipo deve ser um dos seguintes valores: aluno, professor.",
			});
		});

		it("deve requerir os campos obrigatórios para tipo 'aluno'", () => {
			const input = { tipo: "aluno" };
			const output = validator.validate(input);
			expect(output.success).toBe(false);
			const outputErrors = formatErrorZod(output.extra?.error as any);
			expect(outputErrors).toStrictEqual({
				nome: "O campo nome é obrigatório.",
				email: "Por favor, insira um e-mail válido.",
				password: "O campo password é obrigatório.",
				confirm_password: "O campo confirm_password é obrigatório.",
				curso_id: "O campo curso_id é obrigatório.",
				serie_id: "O campo serie_id é obrigatório.",
			});
		});

		it("deve requerir os campos obrigatórios para tipo 'professor'", () => {
			const input = { tipo: "professor" };
			const output = validator.validate(input);
			expect(output.success).toBe(false);
			const outputErrors = formatErrorZod(output.extra?.error as any);
			expect(outputErrors).toStrictEqual({
				nome: "O campo nome é obrigatório.",
				email: "Por favor, insira um e-mail válido.",
				password: "O campo password é obrigatório.",
				confirm_password: "O campo confirm_password é obrigatório.",
				categoriaIds: "O campo categoriaIds é obrigatório.",
			});
		});

		it("deve requerir ao menos um ID em categorIds", () => {
			const input = { tipo: "professor", categoriaIds: [] };
			const output = validator.validate(input);
			expect(output.success).toBe(false);
			const outputErrors = formatErrorZod(output.extra?.error as any);
			expect(outputErrors).toStrictEqual({
				nome: "O campo nome é obrigatório.",
				email: "Por favor, insira um e-mail válido.",
				password: "O campo password é obrigatório.",
				confirm_password: "O campo confirm_password é obrigatório.",
				categoriaIds: "O campo categoriaIds deve conter no minímo 1 valor informado",
			});
		});

		it("deve requerir validar ID como UUID em categoriaIds", () => {
			const input = { tipo: "professor", categoriaIds: ["naoUUId"] };
			const output = validator.validate(input);
			expect(output.success).toBe(false);
			const outputErrors = formatErrorZod(output.extra?.error as any);
			expect(outputErrors).includes({
				categoriaIds: "O campo categoriaIds deve ser um UUID.",
			});
		});

		it("deve requerir apenas ID não repetidos em categoriaIds", () => {
			const id = f.string.uuid();
			const input = { tipo: "professor", categoriaIds: [id, id] };
			const output = validator.validate(input);
			expect(output.success).toBe(false);
			const outputErrors = formatErrorZod(output.extra?.error as any);
			expect(outputErrors).includes({
				categoriaIds: "O campo categoriaIds deve conter apenas valores únicos",
			});
		});

		it("deve validar o tamanho mínimo dos campos", () => {
			const input = {
				nome: "jo",
				password: "12345",
				confirm_password: "12345",
				tipo: "aluno",
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
				tipo: "aluno",
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
				curso_id: f.string.uuid(),
				serie_id: f.string.uuid(),
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

	describe("Update", () => {
		const validator = new userValidator.UpdateValidator();

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
});
