import connection from "../database/db.js";


export async function category (req,res){
    try {

        const categoryName = req.body.name;

        const verifyName = await connection.query(`
            SELECT * FROM 
                categories 
            WHERE 
                name=$1;
            `, [categoryName]
        );
        if(verifyName.rows.length != 0 ){
            return res.status(409).send('Categoria já existente')
        }
        await connection.query(`
            INSERT INTO 
                categories(name) 
            VALUES 
                ($1);
            `,[categoryName]
        );
        return res.sendStatus(201);

    } catch (error) {
        return res.sendStatus(500);
    }
}

export async function allCategory (req,res){
try {
    const categoryName = await connection.query(`
        SELECT * FROM
            categories
    `)
    res.send(categoryName.rows)
    console.log(categoryName, 'CATEGORIA');
} catch (error) {
    
    return res.sendStatus(500)
}

}