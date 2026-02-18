import { beforeAll, describe, expect, it } from "vitest";
import {
	AlunoService,
	AuthService,
	CursoService,
	PasswordService,
	SerieService,
	TokenService,
	UsuarioService,
} from "./index.js";
import { ValidationError } from "../errors/index.js";
import { defaultMessages as dm } from "../validators/index.js";

describe("AuthService", () => {
	const passwordService = new PasswordService();
	const tokenService = new TokenService();
	const alunoService = new AlunoService();
	const usuarioService = new UsuarioService({ alunoService });
	const authService = new AuthService({ passwordService, tokenService, usuarioService });

	beforeAll(async () => {
		const cursoService = new CursoService();
		const serieService = new SerieService();
		const curso_id = (await cursoService.list()).at(0)?.id as string;
		const serie_id = (await serieService.list()).at(0)?.id as string;
		await usuarioService.create({
			nome: "teste",
			email: "authemail@mail.com",
			password: "12345678",
			tipo: "aluno",
			curso_id,
			serie_id,
		});
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
