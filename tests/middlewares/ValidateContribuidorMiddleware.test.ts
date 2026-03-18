import express, { type RequestHandler } from "express";
import request from "supertest";
import {
	errorHandlingMiddleware,
	ValidateContribuidorMiddleware,
	type TCreateDTOContribuidorMiddleware,
	type TUpdateDTOContribuidorMiddleware,
} from "../../src/middlewares/index.js";
import { beforeAll, describe, expect, it } from "vitest";
import { faker as f } from "@faker-js/faker";
import { STATUS_CODE } from "../../src/utils/constants/status-code.js";
import { v4 as uuidV4 } from "uuid";

const createMiddleware = ValidateContribuidorMiddleware.create;
const updateMiddleware = ValidateContribuidorMiddleware.update;

function createTestApp(middleware: RequestHandler) {
	const app = express();
	app.use(express.json());
	app.post("/contribuidores", middleware, (req, res) => res.status(STATUS_CODE.CREATED).json({ ok: true }));
	app.patch("/contribuidores/:id", middleware, (req, res) => res.status(STATUS_CODE.OK).json({ ok: true }));
	app.use(errorHandlingMiddleware);
	return app;
}

describe("ValidateContribuidorMiddleware", () => {
	let app: ReturnType<typeof createTestApp>;

	describe("Create", () => {
		const makeRequest = <T>(data: T) => {
			return request(app)
				.post("/contribuidores")
				.set("Content-Type", "application/json")
				.send(data as object);
		};

		beforeAll(() => {
			app = createTestApp(createMiddleware);
		});

		it("deve retornar 201 para dados válidos", async () => {
			const output = await makeRequest<TCreateDTOContribuidorMiddleware>({
				github_username: "teste",
				tipo_contribuicao_id: f.string.uuid(),
				user_id: f.string.uuid(),
			});
			expect(output.status).toBe(STATUS_CODE.CREATED);
			expect(output.body.ok).toBe(true);
		});

		it("deve retornar 400 para dados inválidos", async () => {
			const output = await makeRequest<TCreateDTOContribuidorMiddleware>({
				github_username: "t",
				tipo_contribuicao_id: "da",
				user_id: "ad",
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
				.patch(`/contribuidores/${id}`)
				.set("Content-Type", "application/json")
				.send(data as object);
		};

		beforeAll(() => {
			app = createTestApp(updateMiddleware as RequestHandler);
		});

		it("deve tornar 200 para dados válidos", async () => {
			const inputId = uuidV4();
			const input = {
				github_username: "teste",
				tipo_contribuicao_id: f.string.uuid(),
				user_id: f.string.uuid(),
			};
			const output = await makeRequest<TUpdateDTOContribuidorMiddleware>(inputId, input);
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
