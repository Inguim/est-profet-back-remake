import { beforeAll, describe, expect, it } from "vitest";
import { ProjetoModel } from "../../src/models/index.js";
import { CategoriaDTO, EstadoDTO, UsuarioProjetoDTO } from "../../src/dto/index.js";
import { UsuarioProfessorFactory } from "../factories/UsuarioProfessorFactory.js";
import { CategoriaService } from "../../src/services/CategoriaService.js";
import { EstadoService } from "../../src/services/EstadoService.js";
import { ProjetoFactory } from "../factories/ProjetoFactory.js";
import { UsuarioProjetoService } from "../../src/services/UsuarioProjetoService.js";
import { UsuarioService } from "../../src/services/UsuarioService.js";
import { AlunoService } from "../../src/services/AlunoService.js";
import { ProfessorService } from "../../src/services/ProfessorService.js";
import { CursoService } from "../../src/services/CursoService.js";
import { SerieService } from "../../src/services/SerieService.js";
import { ProfessorCategoriaService } from "../../src/services/ProfessorCategoriaService.js";

describe("UsuarioProjetoService", () => {
	let defaultCategoriaId: string;
	let defaultEstadoId: string;
	const usuarioProjetoService = new UsuarioProjetoService();
	const categoriaService = new CategoriaService();
	const alunoService = new AlunoService();
	const professorService = new ProfessorService();
	const cursoService = new CursoService();
	const serieService = new SerieService();
	const professorCategoriaService = new ProfessorCategoriaService({ categoriaService });
	const usuarioService = new UsuarioService({
		alunoService,
		professorService,
		cursoService,
		serieService,
		professorCategoriaService,
	});
	const projetoModel = new ProjetoModel();

	beforeAll(async () => {
		const categoriaService = new CategoriaService();
		const estadoService = new EstadoService();
		const [primeiraCategoria] = await categoriaService.list();
		const [primeiroEstado] = await estadoService.list();
		defaultCategoriaId = String((primeiraCategoria as CategoriaDTO).id);
		defaultEstadoId = String((primeiroEstado as EstadoDTO).id);
	});

	it("deve vincular um usuário a um projeto", async () => {
		const usuarioFake = UsuarioProfessorFactory.create().withCategorias([defaultCategoriaId]).build();
		const usuario = await usuarioService.create({
			nome: usuarioFake.nome,
			email: usuarioFake.email,
			tipo: "professor",
			password: usuarioFake.password,
			categoriaIds: usuarioFake.categorias,
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
			result_disc: projetoFake.conclusao,
			categoria_id: projetoFake.categoria_id,
			estado_id: projetoFake.estado_id,
			status: projetoFake.status,
		});
		const output = await usuarioProjetoService.create({
			user_id: String(usuario.id),
			projeto_id: String(projeto.id),
			relacao: "coordenador",
		});
		expect(output).toBeInstanceOf(UsuarioProjetoDTO);
		expect(output.id).toBeDefined();
	});

	it("deve retornar os usuários de um projeto", async () => {
		const usuarioFake = UsuarioProfessorFactory.create().withCategorias([defaultCategoriaId]).build();
		const usuario = await usuarioService.create({
			nome: usuarioFake.nome,
			email: usuarioFake.email,
			tipo: "professor",
			password: usuarioFake.password,
			categoriaIds: usuarioFake.categorias,
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
			result_disc: projetoFake.conclusao,
			categoria_id: projetoFake.categoria_id,
			estado_id: projetoFake.estado_id,
			status: projetoFake.status,
		});
		const output = await usuarioProjetoService.list(String(projeto.id));
		expect(output).toBeInstanceOf(Array);
		expect(output.every((usuario) => usuario instanceof UsuarioProjetoDTO)).toBeTruthy();
	});

	it("deve retornar TRUE para um usuário pertencente a um projeto", async () => {
		const usuarioFake = UsuarioProfessorFactory.create().withCategorias([defaultCategoriaId]).build();
		const usuario = await usuarioService.create({
			nome: usuarioFake.nome,
			email: usuarioFake.email,
			tipo: "professor",
			password: usuarioFake.password,
			categoriaIds: usuarioFake.categorias,
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
			result_disc: projetoFake.conclusao,
			categoria_id: projetoFake.categoria_id,
			estado_id: projetoFake.estado_id,
			status: projetoFake.status,
		});
		await usuarioProjetoService.create({
			user_id: String(usuario.id),
			projeto_id: String(projeto.id),
			relacao: "coordenador",
		});
		const output = await usuarioProjetoService.pertenceAoProjeto(String(usuario.id), String(projeto.id));
		expect(output).toBeTruthy();
	});

	it("deve retornar FALSE para um usuário não pertencente a um projeto", async () => {
		const projetoFake = ProjetoFactory.create().withCategoria(defaultCategoriaId).withEstado(defaultEstadoId).build();
		const [usuarioFakeId] = projetoFake.usuarios;
		const projeto = await projetoModel.create({
			nome: projetoFake.nome,
			resumo: projetoFake.resumo,
			introducao: projetoFake.introducao,
			objetivo: projetoFake.objetivo,
			metodologia: projetoFake.objetivo,
			conclusao: projetoFake.conclusao,
			result_disc: projetoFake.conclusao,
			categoria_id: projetoFake.categoria_id,
			estado_id: projetoFake.estado_id,
			status: projetoFake.status,
		});
		const output = await usuarioProjetoService.pertenceAoProjeto(String(usuarioFakeId), String(projeto.id));
		expect(output).toBeFalsy();
	});
});
