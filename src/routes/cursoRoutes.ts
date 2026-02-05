import { Router } from "express";
import { CursoController } from "../controllers/index.js";
import { CursoService } from "../services/index.js";

const router = Router();
const cursoController = new CursoController({ cursoService: new CursoService() });

router.get("/", (req, res, next) => cursoController.list(req, res, next));

export { router };
