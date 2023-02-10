import { Router } from "express";
import { createCustomers, findAllCustomers, findCustomersId, updateCustomerId } from "../controllers/customers.controllers.js";
import { validSchemaCustomers } from "../middlewares/customers.middleware.js";

const router = Router();

router.post('/customers',validSchemaCustomers, createCustomers);
router.get('/customers',findAllCustomers);
router.get('/customers/:id', findCustomersId);
router.put('/customers/:id',validSchemaCustomers, updateCustomerId);

export default router;