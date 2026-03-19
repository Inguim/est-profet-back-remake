import { describe, expect, it } from "vitest";
import { NoticiaDTO, type INoticiaDTO } from "../../src/dto/index.js";

describe("NoticiaDTO", () => {
	it("deve conter as propriedades de INoticiaDTO", () => {
		const output = new NoticiaDTO({ nome: "teste", link: "asd", user_id: "asd" });
		expect(output).toHaveProperty("id");
		expect(output).toHaveProperty("nome");
		expect(output).toHaveProperty("link");
		expect(output).toHaveProperty("created_at");
		expect(output).toHaveProperty("updated_at");
	});

	it("deve preencher automaticamente os campos não parciais", () => {
		const output = new NoticiaDTO({ nome: "teste", link: "asd", user_id: "asd" });
		expect(output.id).toBeNull();
		expect(output.created_at).toBeUndefined();
		expect(output.updated_at).toBeUndefined();
	});

	it("deve preencher corretamente os campos", () => {
		const input: INoticiaDTO = {
			id: "id123",
			nome: "teste",
			link: "teste",
			user_id: "asd",
			created_at: new Date(),
			updated_at: new Date(),
		};
		const output = new NoticiaDTO(input);
		expect(output).toEqual(input);
	});
});
