import express, { type RequestHandler } from "express";
import request from "supertest";
import {
	errorHandlingMiddleware,
	ValidateNoticiaMiddleware,
	type TCreateDTONoticiaMiddleware,
	type TUpdateDTONoticiaMiddleware,
} from "../../src/middlewares/index.js";
import { beforeAll, describe, expect, it } from "vitest";
import { STATUS_CODE } from "../../src/utils/constants/status-code.js";
import { v4 as uuidV4 } from "uuid";

const createMiddleware = ValidateNoticiaMiddleware.create;
const updateMiddleware = ValidateNoticiaMiddleware.update;

function createTestApp(middleware: RequestHandler) {
	const app = express();
	app.use(express.json());
	app.post("/noticias", middleware, (req, res) => res.status(STATUS_CODE.CREATED).json({ ok: true }));
	app.patch("/noticias/:id", middleware, (req, res) => res.status(STATUS_CODE.OK).json({ ok: true }));
	app.use(errorHandlingMiddleware);
	return app;
}

describe("ValidateNoticiaMiddleware", () => {
	let app: ReturnType<typeof createTestApp>;

	describe("Create", () => {
		const makeRequest = <T>(data: T) => {
			return request(app)
				.post("/noticias")
				.set("Content-Type", "application/json")
				.send(data as object);
		};

		beforeAll(() => {
			app = createTestApp(createMiddleware);
		});

		it("deve retornar 201 para dados válidos", async () => {
			const output = await makeRequest<TCreateDTONoticiaMiddleware>({
				nome: "teste",
				link: "teste",
			});
			expect(output.status).toBe(STATUS_CODE.CREATED);
			expect(output.body.ok).toBe(true);
		});

		it("deve retornar 400 para dados inválidos", async () => {
			const output = await makeRequest<TCreateDTONoticiaMiddleware>({
				nome: "t",
				link: "t",
			});
			expect(output.body).toMatchObject({
				message: expect.any(String),
				status: STATUS_CODE.BAD_REQUEST,
				errors: expect.any(Object),
			});
		});
	});

	describe("Update", () => {
		const makeRequest = <T>(id: string, data: T) => {
			return request(app)
				.patch(`/noticias/${id}`)
				.set("Content-Type", "application/json")
				.send(data as object);
		};

		beforeAll(() => {
			app = createTestApp(updateMiddleware as RequestHandler);
		});

		it("deve tornar 200 para dados válidos", async () => {
			const inputId = uuidV4();
			const input = {
				nome: "teste",
				link: "teste",
			};
			const output = await makeRequest<TUpdateDTONoticiaMiddleware>(inputId, input);
			expect(output.status).toBe(STATUS_CODE.OK);
			expect(output.body.ok).toBe(true);
		});

		it("deve retornar 400 para dados inválidos", async () => {
			const inputId = uuidV4();
			const output = await makeRequest<object>(inputId, {});
			expect(output.body).toMatchObject({
				message: expect.any(String),
				status: STATUS_CODE.BAD_REQUEST,
				errors: expect.any(Object),
			});
		});
	});
});
