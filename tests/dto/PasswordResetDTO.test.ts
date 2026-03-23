import { describe, expect, it } from "vitest";
import { PasswordResetDTO, type IPasswordResetDTO } from "../../src/dto/index.js";

describe("PasswordResetDTO", () => {
	it("deve conter as propriedades de IPasswordResetDTO", () => {
		const output = new PasswordResetDTO({ email: "teste", token: "qwe", created_at: new Date() });
		expect(output).toHaveProperty("email");
		expect(output).toHaveProperty("token");
		expect(output).toHaveProperty("created_at");
	});

	it("deve preencher corretamente os campos", () => {
		const input: IPasswordResetDTO = {
			email: "teste",
			token: "qwe",
			created_at: new Date(),
		};
		const output = new PasswordResetDTO(input);
		expect(output).toEqual(input);
	});
});
