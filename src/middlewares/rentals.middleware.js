import { connectionDB } from "../database/db.js";
import { rentalSchema } from "../models/Rentals.js";

export async function validSchemaRentals(req,res,next){
    const {customerId, gameId, daysRented} = req.body;
    try{
        const game = await connectionDB.query("SELECT * FROM games WHERE id=$1",[gameId]);
        if(game.rowCount === 0){
            return res.sendStatus(400);
        }
        const rentals = {
            customerId,
            gameId,
            daysRented,
            rentDate:new Date(),
            originalPrice:daysRented * game.rows[0].pricePerDay,
            returnDate:null,
            delayFee:null,
        }
        const {error} = rentalSchema.validate(rentals, {abortEarly:false});
        if(error){
            const errors = error.details.map((detail) => detail.message);
            return res.status(400).send({errors});
        }
        const customerExists = await connectionDB.query("SELECT * FROM customers WHERE id=$1",[customerId]);
        if(customerExists.rowCount === 0){
            return res.sendStatus(400);
        };
        res.locals.game = game;
        res.locals.rentals = rentals;

        next();
    }catch(err){
        res.status(500).send(err.message);
    }
}