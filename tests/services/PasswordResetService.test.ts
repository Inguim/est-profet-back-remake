import { beforeAll, describe, expect, it, vi } from "vitest";
import { PasswordResetDTO } from "../../src/dto/PasswordResetDTO.js";
import {
	AlunoService,
	CategoriaService,
	CursoService,
	PasswordResetService,
	ProfessorCategoriaService,
	ProfessorService,
	SerieService,
	UsuarioService,
} from "../../src/services/index.js";
import { UsuarioAlunoFactory } from "../factories/UsuarioAlunoFactory.js";
import { faker as f } from "@faker-js/faker";
import { ExpiredTokenError } from "../../src/errors/ExpiredTokenError.js";

describe("PasswordResetService", () => {
	let defaultEmail: string;

	const alunoService = new AlunoService();
	const categoriaService = new CategoriaService();
	const professorService = new ProfessorService();
	const professorCategoriaService = new ProfessorCategoriaService({ categoriaService });
	const cursoService = new CursoService();
	const serieService = new SerieService();
	const usuarioService = new UsuarioService({
		alunoService,
		professorService,
		cursoService,
		serieService,
		professorCategoriaService,
	});
	const passwordResetService = new PasswordResetService({ usuarioService });

	async function preencherDefaults() {
		const cursoId = (await cursoService.list()).at(0)?.id as string;
		const serieId = (await serieService.list()).at(0)?.id as string;
		const { nome, email, password, curso_id, serie_id } = UsuarioAlunoFactory.create()
			.withCurso(cursoId)
			.withSerie(serieId)
			.build();
		const input = { nome, email, password, curso_id, serie_id, tipo: "aluno" as const };
		const usuario = await usuarioService.create(input);
		defaultEmail = usuario.email;
	}

	beforeAll(async () => {
		await preencherDefaults();
	});

	it("deve retornar um PasswordResetDTO ao solicitar um reset", async () => {
		const output = await passwordResetService.create(defaultEmail);
		expect(output).instanceof(PasswordResetDTO);
	});

	it("deve retornar NULL ao solicitar um reset a um EMAIL inexistente", async () => {
		const input = f.internet.email();
		const output = await passwordResetService.create(input);
		expect(output).toBeNull();
	});

	it("deve retornar FALSE ao atualizar se não encontrar um reset", async () => {
		const output = await passwordResetService.reset("email@test.com", "123456", "nova");
		expect(output).toBeFalsy();
	});

	it("deve lançar erro se o token estiver expirado ao atualizar", async () => {
		vi.useFakeTimers();
		const input = await passwordResetService.create(defaultEmail);
		vi.advanceTimersByTime(15 * 60 * 1_000); // 15 minutos
		await expect(passwordResetService.reset(String(input?.email), String(input?.token), "nova")).rejects.toBeInstanceOf(
			ExpiredTokenError,
		);
	});

	it("deve retornar FALSE ao atualizar se o usuário não existir", async () => {
		const output = await passwordResetService.reset("email@test.com", "123456", "nova");
		expect(output).toBeFalsy();
	});

	it("deve retornar TRUE ao atualizar a senha de um usuario", async () => {
		const input = await passwordResetService.create(defaultEmail);
		const newPassword = f.internet.password();
		const output = await passwordResetService.reset(defaultEmail, String(input?.token), newPassword);
		expect(output).toBeTruthy();
	});
});
