import { describe, it, expect } from "vitest";
import { PagePaginator } from "../../src/utils/helpers/pagePaginator.js";
import dbConnection from "../../src/database/dbConfig.js";

describe("PagePaginator", () => {
	const defaultQuery = dbConnection.table("categorias").select("slug").orderBy("slug", "asc");
	const paginator = new PagePaginator();

	it("deve retornar paginação correta", async () => {
		const output = await paginator.execute(defaultQuery, 1, 5);
		expect(output.data).toBeInstanceOf(Array);
		expect(output.page).toEqual(1);
		expect(output.perPage).toEqual(5);
		expect(output.count).toEqual(9);
		expect(output.totalPages).toEqual(2);
	});

	it("deve aplicar offset corretamente retornando registros diferentes", async () => {
		const output1 = await paginator.execute(defaultQuery, 1, 5);
		const output2 = await paginator.execute(defaultQuery, 2, 5);
		expect(output2.data).not.toEqual(output1.data);
	});

	it("deve limitar perPage ao máximo permitido", async () => {
		const output = await paginator.execute(defaultQuery, 1, 20);
		expect(output.perPage).toEqual(10);
	});

	it("deve calcular totalPages corretamente quando count não é múltiplo", async () => {
		const output = await paginator.execute(defaultQuery, 1, 5);
		expect(output.totalPages).toBe(2);
	});
});
