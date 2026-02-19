import { describe, expect, it } from "vitest";
import { AlunoModel, UsuarioModel, CursoModel, SerieModel } from "../../src/models/index.js";
import { AlunoDTO, type IAlunoDTO } from "../../src/dto/index.js";
import { faker as f } from "@faker-js/faker";

describe("AlunoModel", async () => {
	const alunoModel = new AlunoModel();
	const usuarioModel = new UsuarioModel();
	const cursoModel = new CursoModel();
	const serieModel = new SerieModel();

	const cursos = await cursoModel.list();
	const series = await serieModel.list();

	it("deve criar um aluno", async () => {
		const usuario = await usuarioModel.create({
			nome: f.person.firstName(),
			email: "email1@mail.com",
			tipo: "aluno",
			password: f.internet.password(),
		});
		const input: IAlunoDTO = {
			user_id: usuario.id as string,
			curso_id: cursos.at(0)?.id as string,
			serie_id: series.at(0)?.id as string,
		};
		const output = await alunoModel.create(input);
		expect(output).toBeInstanceOf(AlunoDTO);
	});

	it("deve criar um aluno com os dados corretos", async () => {
		const usuario = await usuarioModel.create({
			nome: f.person.firstName(),
			email: "email2@mail.com",
			tipo: "aluno",
			password: f.internet.password(),
		});
		const input: IAlunoDTO = {
			user_id: usuario.id as string,
			curso_id: cursos.at(0)?.id as string,
			serie_id: series.at(0)?.id as string,
		};
		const output = await alunoModel.create(input);
		expect(output.user_id).toEqual(input.user_id);
		expect(output.curso_id).toEqual(input.curso_id);
		expect(output.serie_id).toEqual(input.serie_id);
	});
});
