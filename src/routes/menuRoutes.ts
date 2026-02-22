import { Router } from "express";
import { MenuController } from "../controllers/index.js";
import { MenuService, CategoriaService } from "../services/index.js";

const router = Router();

const categoriaService = new CategoriaService();
const menuService = new MenuService({ categoriaService });

const menuController = new MenuController({ menuService });

router.get("/", (req, res, next) => menuController.list(req, res, next));

export { router };
