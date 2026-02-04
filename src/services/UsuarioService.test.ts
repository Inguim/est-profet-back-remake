import { describe, expect, it } from "vitest";
import { type TFindOneDTO, UsuarioService } from "./UsuarioService.js";
import { faker as f } from "@faker-js/faker";
import { USUARIO_TIPOS, UsuarioDTO } from "../dto/index.js";
import { v4 as uuidV4 } from "uuid";
import { NotFoundError } from "../errors/index.js";

describe("UsuarioService", () => {
	const service = new UsuarioService();
	const TIPOS = [...USUARIO_TIPOS];
	const WHERE_PARAMS = ["email"];

	it("deve criar um usuário", async () => {
		const output = await service.create({
			nome: f.person.firstName(),
			email: f.internet.email(),
			password: f.internet.password(),
		});
		expect(output).toBeInstanceOf(UsuarioDTO);
		expect(output.id).not.toBeNull();
	});

	it.each(TIPOS)("deve criar um usuário com o tipo: %s", async (tipo) => {
		const output = await service.create({
			nome: f.person.firstName(),
			email: f.internet.email(),
			password: f.internet.password(),
			tipo: tipo,
		});
		expect(output.tipo).toBe(tipo);
	});

	it("deve encontrar um usuário pelo ID", async () => {
		const input = await service.create({
			nome: f.person.firstName(),
			email: f.internet.email(),
			password: f.internet.password(),
		});

		const output = await service.get(input.id as string);
		expect(output?.id).toEqual(output?.id);
	});

	it("deve atualizar as informações do usuário", async () => {
		const input = await service.create({
			nome: f.person.firstName(),
			email: f.internet.email(),
			password: f.internet.password(),
			tipo: "aluno",
		});
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
		await service.create({
			nome: f.person.firstName(),
			email: f.internet.email(),
			password: f.internet.password(),
		});
		const fakeID = uuidV4();
		await expect(service.update(fakeID, { nome: "", email: "", tipo: "professor" })).rejects.toBeInstanceOf(
			NotFoundError,
		);
	});

	it("deve deletar usuário", async () => {
		const input = await service.create({
			nome: f.person.firstName(),
			email: f.internet.email(),
			password: f.internet.password(),
		});
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
			await service.create({
				nome: f.person.firstName(),
				...input,
			});
			const filter = { [String(campo)]: input[campo as keyof TFindOneDTO] };
			const output = await service.findOne(filter);
			expect(output.id).not.toBeNull();
		},
	);
});
