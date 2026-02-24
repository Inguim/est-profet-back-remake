import type { Express } from "express";
import express from "express";
import { router as usuarioRoutes } from "./usuarioRoutes.js";
import { router as authRoutes } from "./authRoutes.js";
import { router as cursoRoutes } from "./cursoRoutes.js";
import { router as serieRoutes } from "./serieRoutes.js";
import { router as menuRoutes } from "./menuRoutes.js";
import { router as estadoRoutes } from "./estadoRoutes.js";

export const routes = (app: Express) => {
	app.use(express.json());
	app.use("/auth", authRoutes);
	app.use("/usuarios", usuarioRoutes);
	app.use("/cursos", cursoRoutes);
	app.use("/series", serieRoutes);
	app.use("/menus", menuRoutes);
	app.use("/estados", estadoRoutes);
};
