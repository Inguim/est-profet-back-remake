import { describe, expect, it } from "vitest";
import { ProfessorDTO, type IProfessorDTO } from "../../src/dto/index.js";
import { ProfessorService } from "../../src/services/index.js";
import { UsuarioModel } from "../../src/models/index.js";
import { UsuarioProfessorFactory } from "../factories/UsuarioProfessorFactory.js";

describe("ProfessorService", () => {
	const service = new ProfessorService();
	const usuarioModel = new UsuarioModel();

	it("deve criar um professor", async () => {
		const { nome, email, password } = UsuarioProfessorFactory.create().build();
		const usuario = await usuarioModel.create({
			tipo: "professor",
			nome,
			email,
			password,
		});
		const input: IProfessorDTO = {
			user_id: String(usuario.id),
		};
		const output = await service.create(input);
		expect(output).toBeInstanceOf(ProfessorDTO);
		expect(output.id).not.toBeNullable();
	});
});
