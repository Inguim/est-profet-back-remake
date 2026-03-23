import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { dataExpirada } from "../../src/utils/helpers/dataExpirada.js";

describe("dataExpirada", () => {
	const AGORA_FIXO = new Date("2026-03-23T12:00:00Z").getTime();
	const QUINZE_MINUTOS = 15 * 60 * 1000;

	beforeAll(() => {
		vi.spyOn(Date, "now").mockReturnValue(AGORA_FIXO);
	});

	afterAll(() => {
		vi.restoreAllMocks();
	});

	it("deve retornar true quando já passaram 15 minutos", () => {
		const data = new Date(AGORA_FIXO - 15 * 60 * 1000);
		expect(dataExpirada(data, QUINZE_MINUTOS)).toBe(true);
	});

	it("deve retornar true quando passaram mais de 15 minutos", () => {
		const data = new Date(AGORA_FIXO - 20 * 60 * 1000);
		expect(dataExpirada(data, QUINZE_MINUTOS)).toBe(true);
	});

	it("deve retornar false quando ainda não passaram 15 minutos", () => {
		const data = new Date(AGORA_FIXO - 10 * 60 * 1000);
		expect(dataExpirada(data, QUINZE_MINUTOS)).toBe(false);
	});

	it("deve retornar false no limite (1ms antes de 15 minutos)", () => {
		const data = new Date(AGORA_FIXO - (15 * 60 * 1000 - 1));
		expect(dataExpirada(data, QUINZE_MINUTOS)).toBe(false);
	});
});
