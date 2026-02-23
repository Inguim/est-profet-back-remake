import { describe, expect, it } from "vitest";
import { UsuarioAlunoDTO, type IUsuarioAlunoDTO } from "../../src/dto/index.js";

describe("UsuarioAlunoDTO", () => {
	it("deve conter as propriedades de IUsuarioAlunoDTO", () => {
		const output = new UsuarioAlunoDTO({
			nome: "ad",
			email: "e@mail.com",
			curso: { curso: "a" },
			serie: { serie: "a" },
		});
		expect(output).toHaveProperty("id");
		expect(output).toHaveProperty("email");
		expect(output).toHaveProperty("tipo");
		expect(output).toHaveProperty("admin");
		expect(output).toHaveProperty("curso");
		expect(output).toHaveProperty("serie");
		expect(output).toHaveProperty("created_at");
		expect(output).toHaveProperty("updated_at");
	});

	it("deve preencher automaticamente os campos não parciais", () => {
		const output = new UsuarioAlunoDTO({
			nome: "ad",
			email: "e@mail.com",
			curso: { curso: "a" },
			serie: { serie: "a" },
		});
		expect(output.id).toBeNull();
		expect(output.created_at).toBeUndefined();
		expect(output.updated_at).toBeUndefined();
	});

	it("deve preencher corretamente os campos", () => {
		const input: IUsuarioAlunoDTO = {
			id: "asdq12323",
			nome: "ad",
			email: "e@mail.com",
			curso: { curso: "a" },
			serie: { serie: "a" },
			status: "analise",
			tipo: "aluno",
			admin: false,
			created_at: new Date(),
			updated_at: new Date(),
		};
		const output = new UsuarioAlunoDTO(input);
		expect(output).toEqual(input);
	});
});
