import express, { type RequestHandler } from "express";
import request from "supertest";
import { errorHandlingMiddleware, ValidateProjetoMiddleware } from "../../src/middlewares/index.js";
import { beforeAll, describe, expect, it } from "vitest";
import { faker as f } from "@faker-js/faker";
import { STATUS_CODE } from "../../src/utils/constants/status-code.js";
import { v4 as uuidV4 } from "uuid";
import { ProjetoFactory } from "../factories/ProjetoFactory.js";
import type {
	TRequestCreateProjetoDTO,
	TRequestUpdateProjetoDTO,
	TRequestUpdateStatusProjetoDTO,
} from "../../src/controllers/ProjetoController.js";
import type { TCreateProjetoMembro } from "../../src/services/ProjetoService.js";

const createMiddleware = ValidateProjetoMiddleware.create;
const updateMiddleware = ValidateProjetoMiddleware.update;
const updateStatusMiddleware = ValidateProjetoMiddleware.updateStatus;

function createTestApp(middleware: RequestHandler) {
	const app = express();
	app.use(express.json());
	app.post("/projeto", middleware, (req, res) => res.status(STATUS_CODE.CREATED).json({ ok: true }));
	app.patch("/projeto/:id", middleware, (req, res) => res.status(STATUS_CODE.OK).json({ ok: true }));
	app.use(errorHandlingMiddleware);
	return app;
}

describe("ValidateUsuarioMiddleware", () => {
	let app: ReturnType<typeof createTestApp>;

	describe("Create", () => {
		const makeRequest = <T>(data: T) => {
			return request(app)
				.post("/projeto")
				.set("Content-Type", "application/json")
				.send(data as object);
		};

		beforeAll(() => {
			app = createTestApp(createMiddleware);
		});

		it("deve retornar 201 para dados válidos", async () => {
			const { nome, resumo, introducao, objetivo, metodologia, result_disc, conclusao, categoria_id, estado_id } =
				ProjetoFactory.create().build();
			const membroInput: TCreateProjetoMembro = { user_id: f.string.uuid(), relacao: "orientador" };
			const output = await makeRequest<TRequestCreateProjetoDTO>({
				projeto: { nome, resumo, introducao, objetivo, metodologia, result_disc, conclusao, categoria_id, estado_id },
				membros: [membroInput],
			});
			expect(output.status).toBe(STATUS_CODE.CREATED);
			expect(output.body.ok).toBe(true);
		});

		it("deve retornar 400 para dados inválidos", async () => {
			const { resumo, introducao, objetivo, metodologia, result_disc, conclusao, categoria_id, estado_id } =
				ProjetoFactory.create().build();
			const membroInput: TCreateProjetoMembro = { user_id: f.string.uuid(), relacao: "bolsista" };
			const output = await makeRequest<TRequestCreateProjetoDTO>({
				projeto: {
					nome: "1",
					resumo,
					introducao,
					objetivo,
					metodologia,
					result_disc,
					conclusao,
					categoria_id,
					estado_id,
				},
				membros: [membroInput],
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
				.patch(`/projeto/${id}`)
				.set("Content-Type", "application/json")
				.send(data as object);
		};

		beforeAll(() => {
			app = createTestApp(updateMiddleware as RequestHandler);
		});

		it("deve tornar 200 para dados válidos", async () => {
			const inputId = uuidV4();
			const { nome, objetivo, introducao, conclusao, metodologia, result_disc, resumo, status } =
				ProjetoFactory.create().build();
			const output = await makeRequest<TRequestUpdateProjetoDTO>(inputId, {
				nome,
				objetivo,
				introducao,
				conclusao,
				metodologia,
				result_disc,
				resumo,
				status,
			});
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

	describe("UpdateStatus", () => {
		const makeRequest = <T>(id: string, data: T) => {
			return request(app)
				.patch(`/projeto/${id}`)
				.set("Content-Type", "application/json")
				.send(data as object);
		};

		beforeAll(() => {
			app = createTestApp(updateStatusMiddleware as RequestHandler);
		});

		it("deve tornar 200 para dados válidos", async () => {
			const inputId = uuidV4();
			const { status } = ProjetoFactory.create().build();
			const output = await makeRequest<TRequestUpdateStatusProjetoDTO>(inputId, { status });
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
