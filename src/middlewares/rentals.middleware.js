import { connectionDB } from "../database/db.js";
import { rentalSchema } from "../models/Rentals.js";
import dayjs from "dayjs";

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
            rentDate:dayjs().format("YYYY-MM-DD"),
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


export async function validateRentalStatus(req, res, next) {
  const { id } = req.params;

  try {
    const result = await connectionDB.query(`
      SELECT r.*, g."pricePerDay" FROM rentals r
        JOIN games g ON r."gameId"= g.id
      WHERE r.id=$1
    `, [id]);

    if (result.rowCount === 0) {
      return res.sendStatus(404);
    }

    if (result.rows[0].returnDate) {
      return res.sendStatus(400);
    }

    res.locals.rental = result.rows[0];
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }

  next();
}