import { Router } from "express";
import { SerieController } from "../controllers/index.js";
import { SerieService } from "../services/index.js";

const router = Router();
const serieController = new SerieController({ serieService: new SerieService() });

router.get("/", (req, res, next) => serieController.list(req, res, next));

export { router };
