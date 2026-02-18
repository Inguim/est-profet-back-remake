import { describe, expect, it } from "vitest";
import { AlunoDTO, type IAlunoDTO } from "../dto/index.js";
import { AlunoService } from "./index.js";
import { CursoModel, SerieModel, UsuarioModel } from "../models/index.js";
import { faker as f } from "@faker-js/faker";

describe("AlunoService", async () => {
	const service = new AlunoService();
	const usuarioModel = new UsuarioModel();
	const cursoModel = new CursoModel();
	const serieModel = new SerieModel();

	const cursos = await cursoModel.list();
	const series = await serieModel.list();

	it("deve criar um aluno", async () => {
		const usuario = await usuarioModel.create({
			nome: f.person.firstName(),
			email: f.internet.email(),
			tipo: "aluno",
			password: f.internet.password(),
		});
		const input: IAlunoDTO = {
			user_id: usuario.id as string,
			curso_id: cursos.at(0)?.id as string,
			serie_id: series.at(0)?.id as string,
		};
		const output = await service.create(input);
		expect(output).toBeInstanceOf(AlunoDTO);
		expect(output.id).not.toBeNullable();
	});
});
