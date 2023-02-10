import { connectionDB } from "../database/db.js";
export async function createCustomers(req,res){
    const {name, phone, cpf, birthday } = res.locals.customer;
    try{
        await connectionDB.query("INSERT INTO customers (name,phone,cpf,birthday) VALUES($1, $2, $3, $4)",[name, phone,cpf,birthday]);
        res.sendStatus(201);
    }catch(err){
        res.status(500).send(err.message);
    }
}
export async function findAllCustomers(req,res){
    try{
        const {rows} = await connectionDB.query("SELECT * FROM customers");
        res.send(rows);
    }catch(err){
        return res.status(500).send(err.message);
    }
}
export async function findCustomersId(req,res){
    const {id} = req.params;

    try{
        const {rows} = await connectionDB.query("SELECT * FROM customers WHERE id=$1",[id]);
        if(rows.length === 0){
            return res.sendStatus(404);
        } else {
            res.send(rows);
        }
    }catch(err){
        return res.status(500).send(err.message);

    }
}
export async function updateCustomerId(req,res){
    const {name, phone, cpf, birthday } = res.locals.customer;
    const {id} = req.params;
    try{
        const {rows} = await connectionDB.query("UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5",[name, phone, cpf, birthday,id])
        res.sendStatus(200);
    }catch(err){
        return res.status(500).send(err.message);
    }

}