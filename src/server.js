import cors from "cors";
import express, {json} from "express";
import dotenv from 'dotenv';
import pg from 'pg';
import { categorySchema } from "./schemas/categorySchema.js";



const { Pool } = pg
dotenv.config();

const server = express();
server.use(cors());
server.use(json());




const connection = new Pool({
    connectionString: process.env.DATABASE_URL,
});


server.post('/categories', async(req,res)=>{

   try {
        const body = req.body;
        const invalidBody = categorySchema.validate(body).error;

        if(invalidBody){
           return res.status(400).send('Nome vazio')
        }

        const categoryName = body.name;

        console.log('passei do schema');

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
       return res.sendStatus(500)
   }
});

server.get('/categories', async(req,res)=>{
    try {
        const categoryName = await connection.query(`
            SELECT * FROM
                categories
        `)
        res.send(categoryName.rows)
        console.log(categoryName, 'CATEGORIA');

    } catch (error) {
        
    }

});


const port = process.env.PORT || 4000;

server.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})