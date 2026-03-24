import { beforeAll, describe, expect, it } from "vitest";
import {
	UsuarioProjetoModel,
	UsuarioModel,
	ProjetoModel,
	CategoriaModel,
	EstadoModel,
} from "../../src/models/index.js";
import { CategoriaDTO, EstadoDTO, UsuarioProjetoDTO } from "../../src/dto/index.js";
import { UsuarioProfessorFactory } from "../factories/UsuarioProfessorFactory.js";
import { ProjetoFactory } from "../factories/ProjetoFactory.js";

describe("UsuarioProjetoModel", () => {
	let defaultCategoriaId: string;
	let defaultEstadoId: string;
	const usuarioModel = new UsuarioModel();
	const projetoModel = new ProjetoModel();
	const usuarioProjetoModel = new UsuarioProjetoModel();

	beforeAll(async () => {
		const categoriasModel = new CategoriaModel();
		const estadoModel = new EstadoModel();
		const [primeiraCategoria] = await categoriasModel.list();
		const [primeiroEstado] = await estadoModel.list();
		defaultCategoriaId = String((primeiraCategoria as CategoriaDTO).id);
		defaultEstadoId = String((primeiroEstado as EstadoDTO).id);
	});

	it("deve vincular um usuario a um projeto", async () => {
		const usuarioFake = UsuarioProfessorFactory.create().build();
		const usuario = await usuarioModel.create({
			nome: usuarioFake.nome,
			email: usuarioFake.email,
			tipo: usuarioFake.tipo,
			password: usuarioFake.password,
			status: usuarioFake.status,
			admin: usuarioFake.admin,
		});
		const projetoFake = ProjetoFactory.create()
			.withCategoria(defaultCategoriaId)
			.withEstado(defaultEstadoId)
			.withUsuarios([String(usuario.id)])
			.build();
		const projeto = await projetoModel.create({
			nome: projetoFake.nome,
			resumo: projetoFake.resumo,
			introducao: projetoFake.introducao,
			objetivo: projetoFake.objetivo,
			metodologia: projetoFake.objetivo,
			conclusao: projetoFake.conclusao,
			result_disc: projetoFake.result_disc,
			categoria_id: projetoFake.categoria_id,
			estado_id: projetoFake.estado_id,
			status: projetoFake.status,
		});
		const output = await usuarioProjetoModel.create({
			user_id: String(usuario.id),
			projeto_id: String(projeto.id),
			relacao: "coordenador",
		});
		expect(output).toBeInstanceOf(UsuarioProjetoDTO);
		expect(output.id).toBeDefined();
		await projetoModel.delete(String(projeto.id));
	});

	it("deve retornar os usuarios de um projeto", async () => {
		const usuarioFake = UsuarioProfessorFactory.create().build();
		const usuario = await usuarioModel.create({
			nome: usuarioFake.nome,
			email: usuarioFake.email,
			tipo: usuarioFake.tipo,
			password: usuarioFake.password,
			status: usuarioFake.status,
			admin: usuarioFake.admin,
		});
		const projetoFake = ProjetoFactory.create()
			.withCategoria(defaultCategoriaId)
			.withEstado(defaultEstadoId)
			.withUsuarios([String(usuario.id)])
			.build();
		const projeto = await projetoModel.create({
			nome: projetoFake.nome,
			resumo: projetoFake.resumo,
			introducao: projetoFake.introducao,
			objetivo: projetoFake.objetivo,
			metodologia: projetoFake.objetivo,
			conclusao: projetoFake.conclusao,
			result_disc: projetoFake.result_disc,
			categoria_id: projetoFake.categoria_id,
			estado_id: projetoFake.estado_id,
			status: projetoFake.status,
		});
		const output = await usuarioProjetoModel.list(String(projeto.id));
		expect(output).toBeInstanceOf(Array);
		expect(output.every((usuario) => usuario.projeto_id === String(projeto.id))).toBeTruthy();
		await projetoModel.delete(String(projeto.id));
	});
});
