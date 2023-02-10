import { connectionDB } from "../database/db.js";
import { gameSchema } from "../models/Games.js";

export async function validSchemaGames(req,res,next){
    const game = req.body;
    const {error} = gameSchema.validate(game, {abortEarly:false});
    if(error){
        const errors = error.details.map(detail => detail.message);
        return res.status(400).send({errors})
    }
    const gameExists = await connectionDB.query("SELECT * FROM games WHERE name=$1",[game.name]);
    if(gameExists.rowCount !== 0){
        res.sendStatus(409);
    }
    res.locals.game = game;
    next();
}