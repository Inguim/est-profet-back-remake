import express, { type RequestHandler } from "express";
import request from "supertest";
import { errorHandlingMiddleware, ValidateUsuarioMiddleware, type CreateDTO } from "./index.js";
import { beforeAll, describe, expect, it } from "vitest";
import { faker as f } from "@faker-js/faker";
import { STATUS_CODE } from "../utils/constansts/status-code.js";

const createMiddleware = ValidateUsuarioMiddleware.create;

function createTestApp(middleware: RequestHandler) {
	const app = express();
	app.use(express.json());
	app.post("/create", middleware, (req, res) => res.status(STATUS_CODE.OK).json({ ok: true }));
	app.use(errorHandlingMiddleware);
	return app;
}

describe("ValidateUsuarioMiddleware", async () => {
	let app: ReturnType<typeof createTestApp>;

	const makeRequest = <T>(data: T) => {
		return request(app)
			.post("/create")
			.set("Content-Type", "application/json")
			.send(data as object);
	};

	const generateUser = (fields: Partial<CreateDTO> = {}): CreateDTO => {
		const password = f.internet.password();
		return {
			nome: f.person.firstName(),
			email: f.internet.email(),
			tipo: "aluno",
			password: password,
			confirm_password: password,
			...fields,
		};
	};

	describe("Create", () => {
		beforeAll(() => {
			app = createTestApp(createMiddleware);
		});

		it("deve retornar 200 para dados válidos", async () => {
			const input = generateUser();
			const output = await makeRequest<CreateDTO>(input);
			expect(output.status).toBe(STATUS_CODE.OK);
			expect(output.body.ok).toBe(true);
		});

		it("deve retornar 400 para dados inválidos", async () => {
			const input = generateUser({ confirm_password: "diferente" });
			const output = await makeRequest<object>(input);
			expect(output.body).toMatchObject({
				message: expect.any(String),
				status: STATUS_CODE.BAD_REQUEST,
				errors: expect.any(Object),
			});
		});
	});
});
