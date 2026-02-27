import { beforeAll, describe, expect, it } from "vitest";
import { UsuarioModel } from "../../src/models/UsuarioModel.js";
import { UsuarioProjetoService } from "../../src/services/UsuarioProjetoService.js";
import { EstadoService } from "../../src/services/EstadoService.js";
import { CategoriaService } from "../../src/services/CategoriaService.js";
import type { CategoriaDTO } from "../../src/dto/CategoriaDTO.js";
import type { EstadoDTO } from "../../src/dto/EstadoDTO.js";
import { UsuarioProfessorFactory } from "../factories/UsuarioProfessorFactory.js";
import { ProjetoFactory } from "../factories/ProjetoFactory.js";
import { ProjetoDTO } from "../../src/dto/ProjetoDTO.js";
import { ProjetoService } from "../../src/services/ProjetoService.js";
import { UsuarioProjetoDTO } from "../../src/dto/UsuarioProjetoDTO.js";

describe("ProjetoService", () => {
	let defaultCategoriaId: string;
	let defaultEstadoId: string;
	const usuarioModel = new UsuarioModel();
	const usuarioProjetoService = new UsuarioProjetoService();
	const projetoService = new ProjetoService({ usuarioProjetoService });

	beforeAll(async () => {
		const categoriaService = new CategoriaService();
		const estadoService = new EstadoService();
		const [primeiraCategoria] = await categoriaService.list();
		const [primeiroEstado] = await estadoService.list();
		defaultCategoriaId = String((primeiraCategoria as CategoriaDTO).id);
		defaultEstadoId = String((primeiroEstado as EstadoDTO).id);
	});

	it("deve criar um projeto", async () => {
		const usuarioFake = UsuarioProfessorFactory.create().withNome("lazim").build();
		const usuario = await usuarioModel.create({
			nome: usuarioFake.nome,
			email: usuarioFake.email,
			tipo: usuarioFake.tipo,
			password: usuarioFake.password,
		});
		const { nome, resumo, introducao, objetivo, conclusao, result_disc, categoria_id, estado_id, metodologia } =
			ProjetoFactory.create()
				.withCategoria(defaultCategoriaId)
				.withEstado(defaultEstadoId)
				.withUsuarios([String(usuario.id)])
				.build();
		const output = await projetoService.create(
			{
				nome,
				resumo,
				introducao,
				objetivo,
				conclusao,
				result_disc,
				categoria_id,
				estado_id,
				metodologia,
			},
			[
				{
					user_id: String(usuario.id),
					relacao: "orientador",
				},
			],
		);
		expect(output).toBeInstanceOf(ProjetoDTO);
		expect(output.id).toBeDefined();
	});

	it("deve ter vinculado os membros ao projeto", async () => {
		const usuarioFake = UsuarioProfessorFactory.create().withNome("lazim").build();
		const usuario = await usuarioModel.create({
			nome: usuarioFake.nome,
			email: usuarioFake.email,
			tipo: usuarioFake.tipo,
			password: usuarioFake.password,
		});
		const { nome, resumo, introducao, objetivo, conclusao, result_disc, categoria_id, estado_id, metodologia } =
			ProjetoFactory.create()
				.withCategoria(defaultCategoriaId)
				.withEstado(defaultEstadoId)
				.withUsuarios([String(usuario.id)])
				.build();
		const projeto = await projetoService.create(
			{
				nome,
				resumo,
				introducao,
				objetivo,
				conclusao,
				result_disc,
				categoria_id,
				estado_id,
				metodologia,
			},
			[
				{
					user_id: String(usuario.id),
					relacao: "orientador",
				},
			],
		);
		const membros = await usuarioProjetoService.list(String(projeto.id));
		const output = membros?.at(0);
		expect(output).toBeInstanceOf(UsuarioProjetoDTO);
		expect(output?.projeto_id).toEqual(projeto.id);
		expect(output?.user_id).toEqual(usuario.id);
		expect(output?.relacao).toEqual("orientador");
	});
});
