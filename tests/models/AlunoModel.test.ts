import { beforeAll, describe, expect, it } from "vitest";
import { AlunoModel, UsuarioModel, CursoModel, SerieModel } from "../../src/models/index.js";
import { AlunoDTO, type IAlunoDTO } from "../../src/dto/index.js";
import { UsuarioAlunoFactory } from "../factories/index.js";

describe("AlunoModel", () => {
	let curso_id: string;
	let serie_id: string;

	const alunoModel = new AlunoModel();
	const usuarioModel = new UsuarioModel();

	beforeAll(async () => {
		const cursos = await new CursoModel().list();
		const series = await new SerieModel().list();
		curso_id = cursos.at(0)?.id as string;
		serie_id = series.at(0)?.id as string;
	});

	it("deve retornar um AlunoDTO ao criar", async () => {
		const { nome, email, tipo, password, admin, status } = UsuarioAlunoFactory.create().build();
		const usuario = await usuarioModel.create({
			nome,
			email,
			tipo,
			password,
			admin,
			status,
		});
		const input: IAlunoDTO = {
			user_id: String(usuario.id),
			curso_id,
			serie_id,
		};
		const output = await alunoModel.create(input);
		expect(output).toBeInstanceOf(AlunoDTO);
	});

	it("retornar um AlunoDTO preenchido corretamente ao criar", async () => {
		const { nome, email, tipo, password, admin, status } = UsuarioAlunoFactory.create().build();
		const usuario = await usuarioModel.create({
			nome,
			email,
			tipo,
			password,
			admin,
			status,
		});
		const input: IAlunoDTO = {
			user_id: String(usuario.id),
			curso_id,
			serie_id,
		};
		const output = await alunoModel.create(input);
		expect(output.user_id).toEqual(input.user_id);
		expect(output.curso_id).toEqual(input.curso_id);
		expect(output.serie_id).toEqual(input.serie_id);
	});

	it("retornar encontrar um aluno por USER_ID", async () => {
		const { nome, email, tipo, password, admin, status } = UsuarioAlunoFactory.create().build();
		const usuario = await usuarioModel.create({
			nome,
			email,
			tipo,
			password,
			admin,
			status,
		});
		const input: IAlunoDTO = {
			user_id: String(usuario.id),
			curso_id,
			serie_id,
		};
		await alunoModel.create(input);
		const output = await alunoModel.get(String(usuario.id));
		expect(String(usuario.id)).toEqual(output.user_id);
	});
});
