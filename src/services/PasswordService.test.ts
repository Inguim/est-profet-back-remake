import { describe, expect, it } from "vitest";
import { PasswordService } from "./PasswordService.js";
import { faker as f } from "@faker-js/faker";

describe("PasswordService", () => {
	it("deve gerar o hash de uma senha", async () => {
		const passwordService = new PasswordService();
		const input = f.lorem.word({ length: { min: 8, max: 16 } });
		const output = await passwordService.hash(input);
		expect(output).not.toEqual(input);
	});
});
