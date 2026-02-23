import { beforeAll, describe, expect, it } from "vitest";
import { CategoriaModel, ProfessorCategoriaModel, ProfessorModel, UsuarioModel } from "../../src/models/index.js";
import { CategoriaDTO, type IProfessorDTO } from "../../src/dto/index.js";
import { UsuarioProfessorFactory } from "../factories/UsuarioProfessorFactory.js";

describe("ProfessorCategoriaModel", () => {
	let defaultCategorias: CategoriaDTO[];
	const usuarioModel = new UsuarioModel();
	const professorModel = new ProfessorModel();
	const professorCategoriaModel = new ProfessorCategoriaModel();

	beforeAll(async () => {
		const modelCategorias = new CategoriaModel();
		defaultCategorias = await modelCategorias.list();
	});

	it("deve vincular uma categoria a um professor", async () => {
		const categoriaId = String(defaultCategorias.at(0)?.id);
		const { nome, email, tipo, password, categorias } = UsuarioProfessorFactory.create()
			.withCategorias([categoriaId])
			.build();
		const usuario = await usuarioModel.create({
			nome,
			email,
			tipo,
			password,
		});
		const input: IProfessorDTO = {
			user_id: String(usuario.id),
		};
		const professor = await professorModel.create(input);
		const output = await professorCategoriaModel.create(String(professor.id), categorias);
		expect(
			output.every(({ professor_id, categoria_id }) => {
				const pertencerAoProfesssor = professor_id === String(professor.id);
				const igualCategoriaInformada = categoria_id === String(categoriaId);
				return pertencerAoProfesssor && igualCategoriaInformada;
			}),
		).toBeTruthy();
	});

	it("deve permitir vincular mais de uma categoria a um professor", async () => {
		const duasPrimeirasCategorias = defaultCategorias.slice(0, -(defaultCategorias.length - 2));
		const categoriaIds = duasPrimeirasCategorias.map((c) => String(c.id));
		const { nome, email, tipo, password, categorias } = UsuarioProfessorFactory.create()
			.withCategorias(categoriaIds)
			.build();
		const usuario = await usuarioModel.create({
			nome,
			email,
			tipo,
			password,
		});
		const input: IProfessorDTO = {
			user_id: String(usuario.id),
		};
		const professor = await professorModel.create(input);
		const output = await professorCategoriaModel.create(String(professor.id), categorias);
		expect(output.every(({ professor_id }) => professor_id === String(professor.id))).toBeTruthy();
		expect(output.length).toBeGreaterThan(1);
	});

	it("deve listar as categorias vinculadas a um professor pelo PROFESSOR_ID", async () => {
		const duasPrimeirasCategorias = defaultCategorias.slice(0, -(defaultCategorias.length - 2));
		const categoriaIds = duasPrimeirasCategorias.map((c) => String(c.id));
		const { nome, email, tipo, password } = UsuarioProfessorFactory.create().withCategorias(categoriaIds).build();
		const usuario = await usuarioModel.create({
			nome,
			email,
			tipo,
			password,
		});
		const input: IProfessorDTO = {
			user_id: String(usuario.id),
		};
		const professor = await professorModel.create(input);
		const output = await professorCategoriaModel.list(String(professor.id));
		expect(output.every(({ professor_id }) => professor_id === String(professor.id))).toBeTruthy();
	});
});
