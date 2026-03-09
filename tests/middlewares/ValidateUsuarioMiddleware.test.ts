import express, { type RequestHandler } from "express";
import request from "supertest";
import {
	errorHandlingMiddleware,
	ValidateUsuarioMiddleware,
	type TCreateDTO,
	type TUpdateDTO,
} from "../../src/middlewares/index.js";
import { beforeAll, describe, expect, it } from "vitest";
import { faker as f } from "@faker-js/faker";
import { STATUS_CODE } from "../../src/utils/constants/status-code.js";
import { v4 as uuidV4 } from "uuid";
import { UsuarioAlunoFactory } from "../factories/UsuarioAlunoFactory.js";

const createMiddleware = ValidateUsuarioMiddleware.create;
const updateMiddleware = ValidateUsuarioMiddleware.update;

function createTestApp(middleware: RequestHandler) {
	const app = express();
	app.use(express.json());
	app.post("/usuario", middleware, (req, res) => res.status(STATUS_CODE.CREATED).json({ ok: true }));
	app.patch("/usuario/:id", middleware, (req, res) => res.status(STATUS_CODE.OK).json({ ok: true }));
	app.use(errorHandlingMiddleware);
	return app;
}

describe("ValidateUsuarioMiddleware", () => {
	let app: ReturnType<typeof createTestApp>;

	describe("Create", () => {
		const makeRequest = <T>(data: T) => {
			return request(app)
				.post("/usuario")
				.set("Content-Type", "application/json")
				.send(data as object);
		};

		beforeAll(() => {
			app = createTestApp(createMiddleware);
		});

		it("deve retornar 201 para dados válidos", async () => {
			const input = UsuarioAlunoFactory.create().build();
			const output = await makeRequest<TCreateDTO>({ ...input, confirm_password: input.password, tipo: "aluno" });
			expect(output.status).toBe(STATUS_CODE.CREATED);
			expect(output.body.ok).toBe(true);
		});

		it("deve retornar 400 para dados inválidos", async () => {
			const input = UsuarioAlunoFactory.create().build();
			const output = await makeRequest<TCreateDTO>({ ...input, confirm_password: "senha diferente", tipo: "aluno" });
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
				.patch(`/usuario/${id}`)
				.set("Content-Type", "application/json")
				.send(data as object);
		};

		beforeAll(() => {
			app = createTestApp(updateMiddleware as RequestHandler);
		});

		it("deve tornar 200 para dados válidos", async () => {
			const inputId = uuidV4();
			const input = { nome: f.person.firstName() };
			const output = await makeRequest<TUpdateDTO>(inputId, input);
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
