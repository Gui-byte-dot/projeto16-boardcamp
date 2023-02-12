import { Router } from "express";
import { create, deleteRental, findAll } from "../controllers/rentals.controllers.js";
import { validSchemaRentals } from "../middlewares/rentals.middleware.js";

const router = Router();

router.post('/rentals',validSchemaRentals, create);
router.get('/rentals', findAll);
router.delete('/rentals/:id', deleteRental);

export default router;