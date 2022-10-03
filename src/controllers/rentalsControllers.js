
import connection from "../database/db.js";
import dayjs from "dayjs";


export async function allRentals (req,res){
    try {
            const searchId = req.query.customerId;
            console.log(searchId)
            if(searchId){
                const rentals = await connection.query(`

                    SELECT
                        rentals.*, customers.name as "custormename", games.name as "gamename", games."categoryId", categories.name as "categoryName"
                    FROM 
                        rentals
                    
                    JOIN 
                        customers
                    ON 
                        rentals."customerId"=$1
                    JOIN 
                        games
                    ON 
                        rentals."gameId"=games.id
                    JOIN 
                        categories 
                    ON 
                        games."categoryId" = categories.id`, [searchId])

            for(let i = 0; i < rentals.rows.length; i++){

                rentals.rows[i].customer = { id:rentals.rows[i].customerId, 
                                            name: rentals.rows[i].customername 
                                            }
                delete rentals.rows[i].customername

                rentals.rows[i].game = { id:rentals.rows[i].gameId, 
                                            name: rentals.rows[i].gamename, 
                                            categoryId: rentals.rows[i].categoryId, 
                                            categoryName: rentals.rows[i].categoryName 
                                        }
                delete rentals.rows[i].gamename
                delete rentals.rows[i].categoryId
                delete rentals.rows[i].categoryName
            }
                    return res.status(200).send(rentals.rows)
            }
            const searchIdGame = req.query.gameId;
       
            if(searchIdGame){
                const rentals = await connection.query(`

                    SELECT
                        rentals.*, customers.name as "custormename", games.name as "gamename", games."categoryId", categories.name as "categoryName"
                    FROM 
                        rentals
                    
                    JOIN 
                        customers
                    ON 
                        rentals."customerId"= customers.id
                    JOIN 
                        games
                    ON 
                        rentals."gameId"=$1
                    JOIN 
                        categories 
                    ON 
                        games."categoryId" = categories.id`, [searchIdGame])

            for(let i = 0; i < rentals.rows.length; i++){

                rentals.rows[i].customer = { id:rentals.rows[i].customerId, 
                                            name: rentals.rows[i].customername 
                                            }
                delete rentals.rows[i].customername

                rentals.rows[i].game = { id:rentals.rows[i].gameId, 
                                        name: rentals.rows[i].gamename, 
                                        categoryId: rentals.rows[i].categoryId, 
                                        categoryName: rentals.rows[i].categoryName 
                                        }
                delete rentals.rows[i].gamename
                delete rentals.rows[i].categoryId
                delete rentals.rows[i].categoryName
            }
                    return res.status(200).send(rentals.rows)
            }

            const rentals = await connection.query(`

                    SELECT
                        rentals.*, customers.name as "custormename", games.name as "gamename", games."categoryId", categories.name as "categoryName"
                    FROM 
                        rentals
                    
                    JOIN 
                        customers
                    ON 
                        rentals."customerId"= customers.id
                    JOIN 
                        games
                    ON 
                        rentals."gameId"=games.id
                    JOIN 
                        categories 
                    ON 
                        games."categoryId" = categories.id`)

            for(let i = 0; i < rentals.rows.length; i++){

                rentals.rows[i].customer = { id:rentals.rows[i].customerId, 
                                            name: rentals.rows[i].customername 
                                            }
                delete rentals.rows[i].customername

                rentals.rows[i].game = { id:rentals.rows[i].gameId, 
                                        name: rentals.rows[i].gamename, 
                                        categoryId: rentals.rows[i].categoryId, 
                                        categoryName: rentals.rows[i].categoryName 
                                        }
                delete rentals.rows[i].gamename
                delete rentals.rows[i].categoryId
                delete rentals.rows[i].categoryName
            }
            return res.status(200).send(rentals.rows)
            
           
        

    } catch (error) {
        return res.sendStatus(500);
    }
}

export async function rental (req,res){

    try {
            const {customerId, gameId} = req.body

            const customer = await connection.query(` 
                SELECT id FROM
                    customers
                WHERE   
                    id=$1;
            `,[customerId])
            if(customer.rows.length === 0 ){
                return res.status(400).send('Usuário não encontrado')
            }

            const game = await connection.query(`
                SELECT 
                    id, "pricePerDay", "stockTotal"
                FROM 
                    games
                WHERE
                    id=$1;
                    
            `,[gameId])
            if(game.rows.length === 0 ){
                return res.status(400).send('Usuário não encontrado');
            }
            console.log(gameId, '********')

            const validationGames = await connection.query(`
                SELECT 
                    *
                FROM
                    rentals

                WHERE 
                    id=$1;
            `, [gameId])

                let contador = 0

                console.log(validationGames.rows[0].returnDate, 'return')
                for (let i = 0; i<validationGames.rows.length; i++) {
                    
                    if(validationGames.rows[i].returnDate === null){
                        contador++;
                        console.log(contador, 'bora contar')
                    }
                }
                console.log(game.rows[0].stockTotal, 'oakso')
                if(contador >= game.rows[0].stockTotal){
                    return res.status(400).send('Jogos indisponível.')
                    
                }
           

            await connection.query(`
		    INSERT INTO rentals
		        ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
		    VALUES ($1, $2, $3, $4, $5, $6, $7)
		`, [req.body.customerId, req.body.gameId, dayjs().format('YYYY-MM-DD'), req.body.daysRented, null, game.rows[0].pricePerDay, null])
		res.sendStatus(201)
    } catch (error) {
        return res.sendStatus(500)
    }
}

/* export async function finishRental (req, res){
	try{
        const {id} = req.params
		const rental = await connection.query('SELECT * FROM rentals WHERE id=$1', [id])
            if(rental.rows.length == 0){
                return res.sendStatus(404);
            }
            if(rental.rows[0].returnDate != null){
                return res.sendStatus(400)
            }
		    rental.rows[0].returnDate = dayjs().format('YYYY-MM-DD')
		    rental.rows[0].rentDate = dayjs(rental.rows[0].rentDate).format('YYYY-MM-DD')

		const firstday = new Date(rental.rows[0].rentDate)
		const seconday = new Date(rental.rows[0].returnDate)
		const totalDays = (seconday - firstday) / (1000 * 3600 * 24)
		const lateDay = totalDays - rental.rows[0].daysRented

		if(lateDay > 0){
			rental.rows[0].delayFee = lateDay * rental.rows[0].originalPrice
		}
		await connection.query(`
		UPDATE 
            rentals
		SET
		    "customerId"=$1, "gameId"=$2, "rentDate"=$3, "daysRented"=$4, "returnDate"=$5, "originalPrice"=$6, "delayFee"=$7
		WHERE id=$8
		`, [rental.rows[0].customerId, rental.rows[0].gameId, rental.rows[0].rentDate, rental.rows[0].daysRented, rental.rows[0].returnDate, rental.rows[0].originalPrice, rental.rows[0].delayFee, rental.rows[0].id])
		return res.sendStatus(200)
	}catch(error){
		console.log(error)
		res.sendStatus(500)
	}
} */