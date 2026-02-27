import { describe, expect, it } from "vitest";
import { ProjetoCompletoDTO } from "../../src/dto/index.js";

describe("ProjetoCompletoDTO", () => {
	const output = new ProjetoCompletoDTO({
		id: "as",
		nome: "a",
		resumo: "a",
		introducao: "a",
		objetivo: "a",
		metodologia: "a",
		result_disc: "a",
		conclusao: "a",
		status: {
			value: "analise",
			label: "Análise",
		},
		categoria: {
			id: "tad",
			nome: "teste",
		},
		estado: {
			id: "tad",
			nome: "teste",
		},
		alunos: [
			{
				id: "asd",
				nome: "te",
				tipo: "aluno",
				relacao: {
					value: "voluntario",
					label: "Voluntário",
				},
			},
		],
		professores: [
			{
				id: "asd",
				nome: "te",
				tipo: "professor",
				relacao: {
					value: "orientador",
					label: "Orientador",
				},
			},
		],
		created_at: new Date(),
		updated_at: new Date(),
	});

	it("deve conter as propriedades de IProjetoCompletoDTO", () => {
		expect(output).toBeInstanceOf(ProjetoCompletoDTO);
		expect(output).toHaveProperty("id");
		expect(output).toHaveProperty("nome");
		expect(output).toHaveProperty("resumo");
		expect(output).toHaveProperty("introducao");
		expect(output).toHaveProperty("objetivo");
		expect(output).toHaveProperty("metodologia");
		expect(output).toHaveProperty("result_disc");
		expect(output).toHaveProperty("conclusao");
		expect(output).toHaveProperty("categoria");
		expect(output).toHaveProperty("estado");
		expect(output).toHaveProperty("alunos");
		expect(output).toHaveProperty("professores");
		expect(output).toHaveProperty("created_at");
		expect(output).toHaveProperty("updated_at");
	});

	it("a propriedade categoria deve ser preenchida corretamente", () => {
		expect(output.categoria).toHaveProperty("id");
		expect(output.categoria).toHaveProperty("nome");
		expect(output.categoria.id).toEqual("tad");
		expect(output.categoria.nome).toEqual("teste");
	});

	it("a propriedade estado deve ser preenchida corretamente", () => {
		expect(output.estado).toHaveProperty("id");
		expect(output.estado).toHaveProperty("nome");
		expect(output.estado.id).toEqual("tad");
		expect(output.estado.nome).toEqual("teste");
	});

	it("a propriedade status deve ser preenchida corretamente", () => {
		expect(output.status).toHaveProperty("value");
		expect(output.status).toHaveProperty("label");
		expect(output.status.value).toEqual("analise");
		expect(output.status.label).toEqual("Análise");
	});

	it("a propriedade alunos deve ser preenchida corretamente", () => {
		const outputAluno = output.alunos.at(0);
		expect(output.alunos).toBeInstanceOf(Array);
		expect(outputAluno).toBeDefined();
		expect(outputAluno).toStrictEqual({
			id: "asd",
			nome: "te",
			tipo: "aluno",
			relacao: {
				value: "voluntario",
				label: "Voluntário",
			},
		});
	});

	it("a propriedade professores deve ser preenchida corretamente", () => {
		const outputProfessor = output.professores.at(0);
		expect(output.professores).toBeInstanceOf(Array);
		expect(outputProfessor).toBeDefined();
		expect(outputProfessor).toStrictEqual({
			id: "asd",
			nome: "te",
			tipo: "professor",
			relacao: {
				value: "orientador",
				label: "Orientador",
			},
		});
	});
});
