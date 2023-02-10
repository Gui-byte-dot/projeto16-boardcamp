import { Router } from "express";
import { create, findAll } from "../controllers/games.controllers.js";
import { validSchemaGames } from "../middlewares/games.middleware.js";

const router = Router();

router.post('/games',validSchemaGames, create);
router.get('/games',findAll);

export default router;