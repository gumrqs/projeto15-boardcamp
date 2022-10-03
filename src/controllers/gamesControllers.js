import connection from "../database/db.js";

export async function games (req, res){

    try {
        const { categoryId, name, stockTotal, pricePerDay, image } = req.body;

        if(pricePerDay < 0 || stockTotal < 0){
            return res.status(400).send('pricePerDay ou stockTotal inválido')
        }
        console.log('passei do if')
        const validationCategoryId = await connection.query(`
            SELECT * FROM 
                categories
            WHERE
                id=$1;
        `,[categoryId]);
        console.log(validationCategoryId.rows, '********')

        if(validationCategoryId.rows.length === 0){
            return res.status(400).send('Id não existente')
        }
        console.log('passei do validação de id');

        const validationName =  await connection.query(`
            SELECT * FROM 
                games   
            WHERE
                name=$1;
        `,[name]);

        console.log("passei do select games");
        if(validationName.rows.length != 0){
            return res.status(409).send('Nome de jogo existente')
        }
        console.log('passei do conflito');

        await connection.query(`
            INSERT INTO 
                games(name,image,"stockTotal","categoryId","pricePerDay") 
            VALUES 
                ($1,$2,$3,$4,$5);
            `,[name, image, stockTotal, categoryId, pricePerDay]
        );
        console.log( "passei do insert");
        return res.sendStatus(201);
    } catch (error) {
        return res.sendStatus(500)
    }
}

export async function allGames (req,res){

    try {

        let game;
        const searchName = req.query.name;

        if(searchName){

        }
        else{
            game = await connection.query(`
            SELECT 
                 games.id, games.name, games.image, games."stockTotal", games."pricePerDay", games."categoryId", categories.name as "categoryName"
            FROM 
                games
            JOIN 
                categories 
            ON 
                categories.id = games."categoryId"
            ;
        `)
        }


        
        return res.status(200).send(game.rows)


    } catch (error) {

        return res.sendStatus(500)
        
    }
}