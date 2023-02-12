import { Router } from "express";
import { create, findAll } from "../controllers/rentals.controllers.js";
import { validSchemaRentals } from "../middlewares/rentals.middleware.js";

const router = Router();

router.post('/rentals',validSchemaRentals, create);
router.get('/rentals', findAll);

export default router;