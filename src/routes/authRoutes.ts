import { Router } from "express";
import { AuthController } from "../controllers/index.js";
import { AuthService } from "../services/AuthService.js";

const authService = new AuthService();
const authController = new AuthController(authService);

const router = Router();

router.post("/login", (req, res, next) => authController.login(req, res, next));

export { router };
