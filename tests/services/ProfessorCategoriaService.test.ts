import { beforeAll, describe, expect, it } from "vitest";
import { ProfessorModel, UsuarioModel } from "../../src/models/index.js";
import { CategoriaDTO, type IProfessorDTO } from "../../src/dto/index.js";
import { UsuarioProfessorFactory } from "../factories/UsuarioProfessorFactory.js";
import { CategoriaService } from "../../src/services/CategoriaService.js";
import { ProfessorCategoriaService } from "../../src/services/ProfessorCategoriaService.js";

describe("ProfessorCategoriaService", () => {
	let defaultCategorias: CategoriaDTO[];
	const usuarioModel = new UsuarioModel();
	const professorModel = new ProfessorModel();
	const categoriaService = new CategoriaService();
	const professorCategoriaService = new ProfessorCategoriaService({ categoriaService });

	beforeAll(async () => {
		const categoriaService = new CategoriaService();
		defaultCategorias = await categoriaService.list();
	});

	it("deve vincular uma categoria a um professor", async () => {
		const categoriaId = String(defaultCategorias.at(0)?.id);
		const { nome, email, tipo, password, categorias, admin, status } = UsuarioProfessorFactory.create()
			.withCategorias([categoriaId])
			.build();
		const usuario = await usuarioModel.create({
			nome,
			email,
			tipo,
			password,
			admin,
			status,
		});
		const input: IProfessorDTO = {
			user_id: String(usuario.id),
		};
		const professor = await professorModel.create(input);
		const output = await professorCategoriaService.create({
			professorId: String(professor.id),
			categoriaIds: categorias,
		});
		expect(output.every(({ professor_id }) => professor_id === String(professor.id))).toBeTruthy();
	});

	it("deve listar as categorias vinculadas a um professor pelo PROFESSOR_ID", async () => {
		const duasPrimeirasCategorias = defaultCategorias.slice(0, -(defaultCategorias.length - 2));
		const categoriaIds = duasPrimeirasCategorias.map((c) => String(c.id));
		const { nome, email, tipo, password, admin, status } = UsuarioProfessorFactory.create()
			.withCategorias(categoriaIds)
			.build();
		const usuario = await usuarioModel.create({
			nome,
			email,
			tipo,
			password,
			admin,
			status,
		});
		const input: IProfessorDTO = {
			user_id: String(usuario.id),
		};
		const professor = await professorModel.create(input);
		const output = await professorCategoriaService.list(String(professor.id));
		expect(output.every((categoria) => categoria instanceof CategoriaDTO)).toBeTruthy();
	});
});
