import { describe, expect, it } from "vitest";
import {
	type TCreateDTO,
	type TCreateDTOAluno,
	type TCreateDTOProfessor,
	type TFindOneDTO,
	UsuarioService,
} from "./UsuarioService.js";
import { faker as f } from "@faker-js/faker";
import { USUARIO_TIPOS, UsuarioDTO, type TUsuarioTipo } from "../dto/index.js";
import { v4 as uuidV4 } from "uuid";
import { NotFoundError } from "../errors/index.js";
import { AlunoService, CursoService, SerieService } from "./index.js";

describe("UsuarioService", async () => {
	let uniqueTracker = 0;
	const service = new UsuarioService({ alunoService: new AlunoService() });
	const TIPOS = [...USUARIO_TIPOS];

	const WHERE_PARAMS = ["email"];

	const cursoModel = new CursoService();
	const serieModel = new SerieService();

	const curso_id = (await cursoModel.list()).at(0)?.id as string;
	const serie_id = (await serieModel.list()).at(0)?.id as string;

	const TIPOS_INPUTS = {
		aluno: { tipo: "aluno", curso_id, serie_id } as TCreateDTOAluno,
		professor: { tipo: "professor" } as TCreateDTOProfessor,
	};

	const generateUsuario = (tipo: TUsuarioTipo = "aluno"): TCreateDTO => {
		uniqueTracker++;
		return {
			nome: f.person.firstName(),
			email: `email${uniqueTracker}@mail.com`,
			password: f.internet.password(),
			...TIPOS_INPUTS[tipo],
		};
	};

	it("deve criar um usuário", async () => {
		const input = generateUsuario();
		const output = await service.create(input);
		expect(output).toBeInstanceOf(UsuarioDTO);
		expect(output.id).not.toBeNull();
	});

	it.each(TIPOS)("deve criar um usuário com o tipo: %s", async (tipo) => {
		const input = generateUsuario(tipo);
		const output = await service.create(input);
		expect(output.tipo).toBe(tipo);
	});

	it("deve encontrar um usuário pelo ID", async () => {
		const input = await service.create(generateUsuario());
		const output = await service.get(input.id as string);
		expect(output?.id).toEqual(output?.id);
	});

	it("deve atualizar as informações do usuário", async () => {
		const input = await service.create(generateUsuario());
		const output = await service.update(input.id as string, {
			nome: "nome alterado",
			email: "email@alterado.com",
			tipo: "professor",
		});
		expect(output?.nome).toBe("nome alterado");
		expect(output?.email).toBe("email@alterado.com");
		expect(output?.tipo).toBe("professor");
	});

	it("deve não atualizar usuário inexistente", async () => {
		const fakeID = uuidV4();
		await expect(service.update(fakeID, { nome: "", email: "", tipo: "professor" })).rejects.toBeInstanceOf(
			NotFoundError,
		);
	});

	it("deve deletar usuário", async () => {
		const input = await service.create(generateUsuario());
		const output = await service.delete(input.id as string);
		expect(output).toBeTruthy();
	});

	it.each(WHERE_PARAMS.map((param, index) => [param, index]))(
		"deve encontrar um usuário pelo campo: %s",
		async (campo, index) => {
			const input = {
				email: `email${index}@mail.com`,
				password: `password${index}`,
			};
			const usuario = generateUsuario();
			await service.create({ ...usuario, ...input });
			const filter = { [String(campo)]: input[campo as keyof TFindOneDTO] };
			const output = await service.findOne(filter);
			expect(output.id).not.toBeNull();
		},
	);
});
