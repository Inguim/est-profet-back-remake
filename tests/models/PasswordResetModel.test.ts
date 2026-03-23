import { describe, expect, it } from "vitest";
import { PasswordResetModel } from "../../src/models/PasswordResetModel.js";
import { faker as f } from "@faker-js/faker";
import { PasswordResetDTO } from "../../src/dto/PasswordResetDTO.js";
import { generateNumberString } from "../../src/utils/helpers/generateNumberString.js";

describe("PasswordResetModel", () => {
	const model = new PasswordResetModel();

	it("deve retornar um PasswordResetDTO ao criar", async () => {
		const output = await model.create({ email: f.internet.email() });
		expect(output).instanceOf(PasswordResetDTO);
	});

	it("deve preencher corretamente o PasswordResetDTO ao criar", async () => {
		const input = f.internet.email();
		const output = await model.create({ email: input });
		expect(output.email).toEqual(input);
		expect(output.token).toBeTypeOf("string");
		expect(output.token).length(6);
		expect(output.created_at).instanceOf(Date);
	});

	it("deve retornar um PasswordResetDTO pelo EMAIL e TOKEN", async () => {
		const input = await model.create({ email: f.internet.email() });
		const output = await model.findOne(input.email, input.token);
		expect(output).toBeInstanceOf(PasswordResetDTO);
		expect(output?.email).toEqual(input.email);
		expect(output?.token).toEqual(input.token);
	});

	it("deve retornar NULL caso não encontrar reset pelo EMAIL e TOKEN", async () => {
		const inputEmail = f.internet.email();
		const inputToken = generateNumberString();
		const output = await model.findOne(inputEmail, inputToken);
		expect(output).toBeNull();
	});

	it("deve retornar TRUE ao excluir um reset", async () => {
		const input = await model.create({ email: f.internet.email() });
		const output = await model.delete(input.email, input.token);
		expect(output).toBeTruthy();
	});

	it("deve retornar FALSE ao excluir um reset inexistente", async () => {
		const inputEmail = f.internet.email();
		const inputToken = generateNumberString();
		const output = await model.delete(inputEmail, inputToken);
		expect(output).toBeFalsy();
	});
});
