import { beforeAll, describe, expect, it } from "vitest";
import { AlunoDTO, type IAlunoDTO } from "../../src/dto/index.js";
import { AlunoService } from "../../src/services/index.js";
import { CursoModel, SerieModel, UsuarioModel } from "../../src/models/index.js";
import { UsuarioAlunoFactory } from "../factories/UsuarioAlunoFactory.js";

describe("AlunoService", () => {
	let cursoId: string;
	let serieId: string;

	const service = new AlunoService();
	const usuarioModel = new UsuarioModel();
	const cursoModel = new CursoModel();
	const serieModel = new SerieModel();

	beforeAll(async () => {
		const cursos = await cursoModel.list();
		const series = await serieModel.list();
		cursoId = String(cursos.at(0)?.id);
		serieId = String(series.at(0)?.id);
	});

	it("deve criar um aluno", async () => {
		const { nome, email, password, curso_id, serie_id, tipo, admin, status } = UsuarioAlunoFactory.create()
			.withCurso(cursoId)
			.withSerie(serieId)
			.build();
		const usuario = await usuarioModel.create({
			tipo,
			nome,
			email,
			password,
			admin,
			status,
		});
		const input: IAlunoDTO = {
			user_id: String(usuario.id),
			curso_id,
			serie_id,
		};
		const output = await service.create(input);
		expect(output).toBeInstanceOf(AlunoDTO);
		expect(output.id).not.toBeNullable();
	});

	it("deve encontrar um aluno pelo USER_ID", async () => {
		const { nome, email, password, curso_id, serie_id, tipo, admin, status } = UsuarioAlunoFactory.create()
			.withCurso(cursoId)
			.withSerie(serieId)
			.build();
		const usuario = await usuarioModel.create({
			tipo,
			nome,
			email,
			password,
			admin,
			status,
		});
		const input: IAlunoDTO = {
			user_id: String(usuario.id),
			curso_id,
			serie_id,
		};
		await service.create(input);
		const output = await service.getByUserId(String(usuario.id));
		expect(output).toBeInstanceOf(AlunoDTO);
		expect(output.id).not.toBeNullable();
	});
});
