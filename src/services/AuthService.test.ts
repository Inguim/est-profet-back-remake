import { describe, expect, it } from "vitest";
import { AuthService, UsuarioService } from "./index.js";
import { ValidationError } from "../errors/index.js";
import { defaultMessages as dm } from "../validators/index.js";

const usuarioService = new UsuarioService();
const authService = new AuthService();

describe("AuthService", async () => {
	await usuarioService.create({
		nome: "teste",
		email: "authemail@mail.com",
		password: "12345678",
	});

	it("deve retornar um token JWT é o usuário ao logar", async () => {
		const input = { email: "authemail@mail.com", password: "12345678" };
		const output = await authService.login(input);
		expect(output.token).toBeDefined();
		expect(output.usuario).toBeDefined();
	});

	it("deve lançar execeção para ValidationError credencias inválidas", async () => {
		const input = { email: "authemail@mail.com", password: "1234567" };
		try {
			await authService.login(input);
			expect.fail("Deveria lançar ValidationError");
		} catch (error) {
			expect(error).toBeInstanceOf(ValidationError);
			expect((error as ValidationError).errors).toStrictEqual({
				credencias_invalidas: dm.credencias_invalidas,
			});
		}
	});
});
