import { describe, expect, it } from "vitest";
import { ProfessorModel, UsuarioModel } from "../../src/models/index.js";
import { ProfessorDTO, type IProfessorDTO } from "../../src/dto/index.js";
import { UsuarioProfessorFactory } from "../factories/index.js";

describe("ProfessorModel", () => {
	const usuarioModel = new UsuarioModel();
	const professorModel = new ProfessorModel();

	it("deve retornar um ProfessorDTO ao criar", async () => {
		const { nome, email, tipo, password } = UsuarioProfessorFactory.create().build();
		const usuario = await usuarioModel.create({
			nome,
			email,
			tipo,
			password,
		});
		const input: IProfessorDTO = {
			user_id: String(usuario.id),
		};
		const output = await professorModel.create(input);
		expect(output).toBeInstanceOf(ProfessorDTO);
	});

	it("retornar um ProfessorDTO preenchido corretamente ao criar", async () => {
		const { nome, email, tipo, password } = UsuarioProfessorFactory.create().build();
		const usuario = await usuarioModel.create({
			nome,
			email,
			tipo,
			password,
		});
		const input: IProfessorDTO = {
			user_id: String(usuario.id),
		};
		const output = await professorModel.create(input);
		expect(output.user_id).toEqual(input.user_id);
	});

	it("retornar encontrar um professor por USER_ID", async () => {
		const { nome, email, tipo, password } = UsuarioProfessorFactory.create().build();
		const usuario = await usuarioModel.create({
			nome,
			email,
			tipo,
			password,
		});
		const input: IProfessorDTO = {
			user_id: String(usuario.id),
		};
		await professorModel.create(input);
		const output = await professorModel.get(String(usuario.id));
		expect(String(usuario.id)).toEqual(output.user_id);
	});
});
