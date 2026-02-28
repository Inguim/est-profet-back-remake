import { beforeAll, describe, expect, it } from "vitest";
import { EstadoModel } from "../../src/models/index.js";
import { EstadoDTO } from "../../src/dto/index.js";

describe("EstadoModel", () => {
	let defaultCategorias: EstadoDTO[];
	const model = new EstadoModel();

	beforeAll(async () => {
		defaultCategorias = await model.list();
	});

	it("deve retornar uma lista de estados", async () => {
		const output = await model.list();
		expect(output).toBeInstanceOf(Array);
		expect(output.at(0)).toBeInstanceOf(EstadoDTO);
	});

	it("deve retornar valores com o mesmo valor de ID", async () => {
		const input = defaultCategorias.at(0)?.id;
		const output = await model.list({ id: [String(input)] });
		expect(output.length).toEqual(1);
		expect(output.map((categoria) => categoria.id)).toContain(input);
	});
});
