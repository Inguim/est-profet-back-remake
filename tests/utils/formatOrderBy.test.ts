import { describe, it, expect } from "vitest";
import { formatOrderBy } from "../../src/utils/helpers/formatOrderBy.js";

describe("formatOrderBy", () => {
	it("deve separar corretamente coluna e ordenação", () => {
		const output = formatOrderBy("name__desc");
		expect(output).toEqual({
			column: "name",
			sort: "desc",
		});
	});

	it("deve usar ASC como padrão quando sort não for informado", () => {
		const output = formatOrderBy("name");
		expect(output).toEqual({
			column: "name",
			sort: "asc",
		});
	});

	it("deve retornar coluna vazia e ASC quando entrada for vazia", () => {
		const output = formatOrderBy("");
		expect(output).toEqual({
			column: "",
			sort: "asc",
		});
	});

	it("deve lidar com valores UNDEFINED", () => {
		const output = formatOrderBy(undefined as any);
		expect(output).toEqual({
			column: "undefined",
			sort: "asc",
		});
	});

	it("deve lidar com valores NULL", () => {
		const output = formatOrderBy(null as any);
		expect(output).toEqual({
			column: "null",
			sort: "asc",
		});
	});

	it("deve ignorar partes extras após o segundo separador", () => {
		const output = formatOrderBy("name__desc__extra");
		expect(output).toEqual({
			column: "name",
			sort: "desc",
		});
	});

	it("deve aceitar sort diferente de ASC/DESC (sem validação)", () => {
		const output = formatOrderBy("name__invalid");
		expect(output).toEqual({
			column: "name",
			sort: "invalid", // função não valida
		});
	});

	it("deve funcionar com números (cast para string)", () => {
		const output = formatOrderBy(123 as any);
		expect(output).toEqual({
			column: "123",
			sort: "asc",
		});
	});
});
