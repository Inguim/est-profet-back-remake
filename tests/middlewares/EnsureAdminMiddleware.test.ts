import express, { type RequestHandler } from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { ensureAdminMiddleware, type IAuthRequest } from "../../src/middlewares/index.js";

function createTestApp(admin: boolean) {
	const app = express();
	app.use((req: IAuthRequest, _res, next) => {
		req.usuarioAdmin = admin;
		next();
	});
	app.get("/protected", ensureAdminMiddleware as RequestHandler, (req, res) => {
		res.status(200).json({ ok: true });
	});
	return app;
}

describe("EnsureAdminMiddleware", async () => {
	it("deve permitir acesso caso ADMIN TRUE", async () => {
		const app = createTestApp(true);
		const output = await request(app).get("/protected");
		expect(output.status).toBe(200);
		expect(output.body.ok).toBe(true);
	});

	it("deve não permitir acesso caso ADMIN FALSE", async () => {
		const app = createTestApp(false);
		const output = await request(app).get("/protected");
		expect(output.status).toBe(401);
	});
});
