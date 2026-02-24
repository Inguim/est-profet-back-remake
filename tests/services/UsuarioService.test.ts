import { beforeAll, describe, expect, it } from "vitest";
import {
	type TCreateDTOAluno,
	type TCreateDTOProfessor,
	type TFindOneDTO,
	UsuarioService,
} from "../../src/services/UsuarioService.js";
import { CategoriaDTO, USUARIO_TIPOS, UsuarioAlunoDTO, UsuarioDTO, UsuarioProfessorDTO } from "../../src/dto/index.js";
import { v4 as uuidV4 } from "uuid";
import { NotFoundError } from "../../src/errors/index.js";
import {
	AlunoService,
	CategoriaService,
	CursoService,
	ProfessorCategoriaService,
	ProfessorService,
	SerieService,
} from "../../src/services/index.js";
import { UsuarioAlunoFactory } from "../factories/UsuarioAlunoFactory.js";
import { UsuarioProfessorFactory } from "../factories/UsuarioProfessorFactory.js";

describe("UsuarioService", () => {
	let defaultCategorias: CategoriaDTO[];
	let duasCategoriasIds: string[];
	let cursoId: string;
	let serieId: string;
	const TIPOS_INPUTS = {
		aluno: { tipo: "aluno", curso_id: "", serie_id: "" } as TCreateDTOAluno,
		professor: { tipo: "professor" } as TCreateDTOProfessor, // adicionar categorias
	};
	const TIPOS = [...USUARIO_TIPOS];
	const WHERE_PARAMS = ["email"];

	const alunoService = new AlunoService();
	const categoriaService = new CategoriaService();
	const professorService = new ProfessorService();
	const professorCategoriaService = new ProfessorCategoriaService({ categoriaService });
	const cursoService = new CursoService();
	const serieService = new SerieService();
	const service = new UsuarioService({
		alunoService,
		professorService,
		cursoService,
		serieService,
		professorCategoriaService,
	});

	beforeAll(async () => {
		const cursoService = new CursoService();
		const serieService = new SerieService();
		defaultCategorias = await categoriaService.list();
		duasCategoriasIds = defaultCategorias.slice(0, -(defaultCategorias.length - 2)).map((c) => String(c.id));
		cursoId = (await cursoService.list()).at(0)?.id as string;
		serieId = (await serieService.list()).at(0)?.id as string;
		TIPOS_INPUTS["aluno"] = { tipo: "aluno", curso_id: cursoId, serie_id: serieId };
	});

	it("deve criar um usuário", async () => {
		const { nome, email, password, curso_id, serie_id } = UsuarioAlunoFactory.create()
			.withCurso(cursoId)
			.withSerie(serieId)
			.build();
		const input = { nome, email, password, curso_id, serie_id, tipo: "aluno" as const };
		const output = await service.create(input);
		expect(output).toBeInstanceOf(UsuarioDTO);
		expect(output.id).not.toBeNull();
	});

	it.each(TIPOS)("deve criar um usuário com o tipo: %s", async (tipo) => {
		let output;
		if (tipo == "aluno") {
			const { nome, email, password, curso_id, serie_id } = UsuarioAlunoFactory.create()
				.withCurso(cursoId)
				.withSerie(serieId)
				.build();
			output = await service.create({ tipo: "aluno", nome, email, password, curso_id, serie_id });
		} else {
			const { nome, email, password, categorias } = UsuarioProfessorFactory.create()
				.withCategorias(duasCategoriasIds)
				.build();
			output = await service.create({ tipo: "professor", nome, email, password, categoriaIds: categorias });
		}
		expect(output.tipo).toBe(tipo);
	});

	it("deve encontrar um usuário pelo ID", async () => {
		const { nome, email, password, curso_id, serie_id } = UsuarioAlunoFactory.create()
			.withCurso(cursoId)
			.withSerie(serieId)
			.build();
		const usuario = { nome, email, password, curso_id, serie_id, tipo: "aluno" as const };
		const input = await service.create(usuario);
		const output = await service.get(input.id as string);
		expect(output?.id).toEqual(output?.id);
	});

	it("deve retornar um UsuarioAlunoDTO pelo ID", async () => {
		const { nome, email, password, curso_id, serie_id } = UsuarioAlunoFactory.create()
			.withCurso(cursoId)
			.withSerie(serieId)
			.build();
		const usuario = { nome, email, password, curso_id, serie_id, tipo: "aluno" as const };
		const input = await service.create(usuario);
		const output = await service.get(input.id as string);
		expect(output).toBeInstanceOf(UsuarioAlunoDTO);
	});

	it("deve retornar um UsuarioProfessorDTO pelo ID", async () => {
		const { nome, email, password, categorias } = UsuarioProfessorFactory.create()
			.withCategorias(duasCategoriasIds)
			.build();
		const usuario = { nome, email, password, tipo: "professor" as const, categoriaIds: categorias };
		const input = await service.create(usuario);
		const output = await service.get(input.id as string);
		expect(output).toBeInstanceOf(UsuarioProfessorDTO);
	});

	it("deve atualizar as informações do usuário", async () => {
		const { nome, email, password, curso_id, serie_id } = UsuarioAlunoFactory.create()
			.withCurso(cursoId)
			.withSerie(serieId)
			.build();
		const usuario = { nome, email, password, curso_id, serie_id, tipo: "aluno" as const };
		const input = await service.create(usuario);
		const output = await service.update(input.id as string, {
			nome: "nome alterado",
			email: "emailusuarioservice@alterado.com",
			tipo: "professor",
		});
		expect(output?.nome).toBe("nome alterado");
		expect(output?.email).toBe("emailusuarioservice@alterado.com");
		expect(output?.tipo).toBe("professor");
	});

	it("deve não atualizar usuário inexistente", async () => {
		const fakeID = uuidV4();
		await expect(service.update(fakeID, { nome: "", email: "", tipo: "professor" })).rejects.toBeInstanceOf(
			NotFoundError,
		);
	});

	it("deve deletar usuário", async () => {
		const { nome, email, password, curso_id, serie_id } = UsuarioAlunoFactory.create()
			.withCurso(cursoId)
			.withSerie(serieId)
			.build();
		const usuario = { nome, email, password, curso_id, serie_id, tipo: "aluno" as const };
		const input = await service.create(usuario);
		const output = await service.delete(input.id as string);
		expect(output).toBeTruthy();
	});

	it.each(WHERE_PARAMS.map((param, index) => [param, index]))(
		"deve encontrar um usuário pelo campo: %s",
		async (campo, index) => {
			const input = {
				email: `emailusuarioservice${index}@mail.com`,
			};
			const { nome, email, password, curso_id, serie_id } = UsuarioAlunoFactory.create()
				.withEmail(input["email"])
				.withCurso(cursoId)
				.withSerie(serieId)
				.build();
			await service.create({ nome, email, password, curso_id, serie_id, tipo: "aluno" as const });
			const filter = { [String(campo)]: input[campo as keyof TFindOneDTO] };
			const output = await service.findOne(filter);
			expect(output.id).not.toBeNull();
		},
	);
});
