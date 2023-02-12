import { connectionDB } from "../database/db.js";
export async function create(req,res){
    const {name, image, stockTotal,pricePerDay} = res.locals.game;
    try{
        await connectionDB.query('INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4)',[name,image,stockTotal,pricePerDay]);
        res.sendStatus(201);
    }catch(err){
        res.status(500).send(err.message);
    }
}
export async function findAll(req,res){
    const {name} = req.query;
    try{
        const rowsGames = await connectionDB.query(`SELECT * FROM games WHERE name LIKE '${name}%'`);
        if(rowsGames.rowCount === 0 && name===undefined){
            const {rows} = await connectionDB.query("SELECT * FROM games");
            res.send(rows);
        } else if(rowsGames.rowCount === 0 && name!==undefined) {
            res.send([]);
        } else {
            res.send(rowsGames.rows);
        }

    }catch(err){
        return res.status(500).send(err.message);
    }
}

// SELECT * FROM Customers
// WHERE CustomerName LIKE 'a%';