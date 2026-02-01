import { describe, expect, it, vi } from "vitest";
import { TokenService } from "./index.js";
import { ExpiredTokenError, InvalidTokenError } from "../errors/index.js";

interface IPayload {
	id: string;
	nome: string;
}

const tokenService = new TokenService(2);

describe("TokenService", () => {
	it("deve retornar um token", async () => {
		const output = tokenService.create({ id: 2026 });
		expect(output).toBeDefined();
		expect(output).toBeTypeOf("string");
	});

	it("deve conter as propriedades fornecidas ao token", async () => {
		const input = { id: 2026, nome: "teste" };
		const token = tokenService.create(input);
		const output = tokenService.decode<IPayload>(token);
		expect(output).toHaveProperty("id");
		expect(output).toHaveProperty("nome");
		expect(output.id).toEqual(2026);
		expect(output.nome).toEqual("teste");
	});

	it("deve lançar execeção InvalidTokenError", async () => {
		expect(() => tokenService.validate("inválido")).toThrowError(InvalidTokenError);
	});

	it("deve lançar execeção ExpiredTokenError", async () => {
		vi.useFakeTimers();
		const input = tokenService.create({ id: 2026 });
		vi.advanceTimersByTime(2000);
		expect(() => tokenService.validate(input)).toThrowError(ExpiredTokenError);
		vi.useRealTimers();
	});
});
