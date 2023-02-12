import { connectionDB } from "../database/db.js";

export async function create(req,res){
    const{customerId, gameId, daysRented, rentDate, originalPrice, returnDate, delayFee} = res.locals.rentals;

    try{
        await connectionDB.query(`INSERT INTO rentals ("customerId","gameId","daysRented","rentDate","originalPrice","returnDate","delayFee") VALUES ($1,$2,$3,$4,$5,$6,$7)`,[customerId,gameId,daysRented,rentDate,originalPrice,returnDate,delayFee]);
        res.sendStatus(201);
    }catch (err){
        console.log(err);
        res.status(500).send(err.message);
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