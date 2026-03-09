import express, { type RequestHandler } from "express";
import request from "supertest";
import { errorHandlingMiddleware, ValidateSolicitacaoMiddleware } from "../../src/middlewares/index.js";
import { beforeAll, describe, expect, it } from "vitest";
import { faker as f } from "@faker-js/faker";
import { STATUS_CODE } from "../../src/utils/constansts/status-code.js";
import type { TCreateDTOBodySolicitacao } from "../../src/controllers/SolicitacaoController.js";

const createMiddleware = ValidateSolicitacaoMiddleware.create;

function createTestApp(middleware: RequestHandler) {
	const app = express();
	app.use(express.json());
	app.post("/solicitacao", middleware, (req, res) => res.status(STATUS_CODE.CREATED).json({ ok: true }));
	app.use(errorHandlingMiddleware);
	return app;
}

describe("ValidateUsuarioMiddleware", () => {
	let app: ReturnType<typeof createTestApp>;

	describe("Create", () => {
		const makeRequest = <T>(data: T) => {
			return request(app)
				.post("/solicitacao")
				.set("Content-Type", "application/json")
				.send(data as object);
		};

		beforeAll(() => {
			app = createTestApp(createMiddleware);
		});

		it("deve retornar 201 para dados válidos", async () => {
			const output = await makeRequest<TCreateDTOBodySolicitacao>({
				titulo: "teste",
				descricao: "teste",
				projeto_id: f.string.uuid(),
			});
			expect(output.status).toBe(STATUS_CODE.CREATED);
			expect(output.body.ok).toBe(true);
		});

		it("deve retornar 400 para dados inválidos", async () => {
			const output = await makeRequest<TCreateDTOBodySolicitacao>({
				titulo: "",
				descricao: "",
				projeto_id: "",
			});
			expect(output.body).toMatchObject({
				message: expect.any(String),
				status: STATUS_CODE.BAD_REQUEST,
				errors: expect.any(Object),
			});
		});
	});
});
