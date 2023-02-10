import { connectionDB } from "../database/db.js";
import { customerSchema } from "../models/Customers.js";

export async function validSchemaCustomers(req,res,next){
    const customer = req.body;
    const {error} = customerSchema.validate(customer, {abortEarly:false});
    if(error){
        const errors = error.details.map(detail => detail.message);
        return res.status(400).send({errors})
    }
    const cpfExists = await connectionDB.query("SELECT * FROM customers WHERE cpf=$1",[customer.cpf]);
    if(cpfExists.rowCount !== 0){
        return res.sendStatus(409);
    }
    res.locals.customer = customer;
    next();
}