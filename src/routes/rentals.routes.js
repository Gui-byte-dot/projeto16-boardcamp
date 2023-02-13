import { Router } from "express";
import { create, deleteRental, findAll, returnRental } from "../controllers/rentals.controllers.js";
import { validateRentalStatus, validSchemaRentals } from "../middlewares/rentals.middleware.js";

const router = Router();

router.post('/rentals',validSchemaRentals, create);
router.get('/rentals', findAll);
router.delete('/rentals/:id', deleteRental);
router.post('/rentals/:id/return',validateRentalStatus,returnRental);

export default router;