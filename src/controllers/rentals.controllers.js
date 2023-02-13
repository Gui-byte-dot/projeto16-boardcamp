import { connectionDB } from "../database/db.js";
import dayjs from "dayjs";

export async function create(req,res){
    const{customerId, gameId, daysRented, rentDate, originalPrice, returnDate, delayFee} = res.locals.rentals;

    try{
        await connectionDB.query(`INSERT INTO rentals ("customerId","gameId","daysRented","rentDate","originalPrice","returnDate","delayFee") VALUES ($1,$2,$3,$4,$5,$6,$7)`,[customerId,gameId,daysRented,rentDate,originalPrice,returnDate,delayFee]);
        res.sendStatus(201);
    }catch (err){
        console.log(err);
        res.status(400).send(err.message);
    }
}
export async function findAll(req,res){
    try{
        const getAllRentals = await connectionDB.query
        ( `
            SELECT
                games.id AS "gamesId",
                games.name AS "gameName",
                customers.id AS "customersId",
                customers.name AS "customerName",
                rentals.id AS "rentalsId",
                rentals."customerId" AS "rentalsCustomerId",
                rentals."gameId" AS "rentalsGameId",
                rentals."daysRented" AS "rentalsDaysRented",
                rentals."rentDate" AS "rentalsRentDate",
                rentals."originalPrice" AS "rentalsOriginalPrice",
                rentals."returnDate" AS "rentalsReturnDate",
                rentals."delayFee" AS "rentalsDelayFee"
            FROM
                rentals
            JOIN
                customers
            ON
                rentals."customerId" = customers.id
            JOIN
                games
            ON
                rentals."gameId" = games.id
        `);
        const allRentals = getAllRentals.rows.map((ord) => ({
            id:ord.rentalsId,
            customerId:ord.rentalsCustomerId,
            gameId:ord.rentalsGameId,
            rentDate:ord.rentalsRentDate,
            daysRented:ord.rentalsDaysRented,
            returnDate:ord.rentalsReturnDate,
            originalPrice:ord.rentalsOriginalPrice,
            delayFee:ord.rentalsDelayFee,
            customer: {
                id:ord.customersId,
                name:ord.customerName
            },
            game: {
                id: ord.gamesId,
                name:ord.gameName
            }
        }))

        res.send(allRentals).status(200);
    }catch(err){
        res.status(500).send(err.message);
    }
    
}

export async function deleteRental(req,res){
    const {id} = req.params;
    const idRental = await connectionDB.query("SELECT * FROM rentals WHERE id=$1",[id]);
    if(idRental.rowCount === 0){
        return res.sendStatus(404);
    } 
    if(!idRental.rows[0].returnDate){
        return res.sendStatus(400);
    }

    await connectionDB.query("DELETE FROM rentals WHERE id=$1",[id]);
    console.log(idRental);
    res.sendStatus(200);
}

export async function returnRental(req, res) {
    const { rentDate, daysRented, pricePerDay, id } = res.locals.rental;
    let delayFee = 0;
    
    const returnDate = dayjs();
    const deadline = dayjs(rentDate).add(daysRented, "day");
    const isOverdue = dayjs(returnDate).isAfter(deadline);
  
    if (isOverdue) {
      const daysExceeded = (returnDate - deadline) / (1000 * 3600 * 24);
      delayFee = pricePerDay * Math.ceil(daysExceeded);
    }
  
    try {
      await connectionDB.query(`
        UPDATE rentals 
          SET "returnDate"=$1, "delayFee"=$2
        WHERE id=$3
      `, [returnDate.format("YYYY-MM-DD"), delayFee, id]);
  
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

