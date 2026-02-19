import express, { type RequestHandler } from "express";
import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import { TokenService } from "../../src/services/index.js";
import { ensureAuthMiddleware } from "../../src/middlewares/index.js";

const tokenService = new TokenService();

function createTestApp() {
	const app = express();
	app.get("/protected", ensureAuthMiddleware as RequestHandler, (req, res) => {
		res.status(200).json({ ok: true });
	});
	return app;
}

describe("EnsureAuthMiddleware", async () => {
	let app: ReturnType<typeof createTestApp>;

	beforeAll(() => {
		app = createTestApp();
	});

	const makeRequest = (token: string) => {
		return request(app).get("/protected").set("Authorization", `Bearer ${token}`);
	};

	it("deve permitir acesso com JWT válido", async () => {
		const input = tokenService.create({ id: 2026 });
		const output = await makeRequest(input);
		expect(output.status).toBe(200);
		expect(output.body.ok).toBe(true);
	});

	it("não deve permitir acesso sem JWT", async () => {
		const output = await makeRequest("");
		expect(output.status).toBe(401);
	});
});
