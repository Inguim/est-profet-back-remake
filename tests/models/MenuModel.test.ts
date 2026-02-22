import { describe, expect, it } from "vitest";
import { MenuModel } from "../../src/models/index.js";
import { MenuDTO } from "../../src/dto/index.js";

describe("MenuModel", () => {
	it("deve retornar uma lista de menus", async () => {
		const model = new MenuModel();
		const output = await model.list();
		expect(output).toBeInstanceOf(Array);
		expect(output.at(0)).toBeInstanceOf(MenuDTO);
	});
});
