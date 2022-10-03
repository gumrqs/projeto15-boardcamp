import connection from "../database/db.js";

export async function insertClient (req,res){

    try {

        const {cpf, name, phone, birthday} = req.body;

        const validationCpf = await connection.query(`
            SELECT * FROM
                customers
            WHERE
                cpf=$1;
        `,[cpf])
      console.log('passei da validação')
        if(validationCpf.rows.length !==0){
            return res.status(409).send('Cpf já está sendo utilizado')
        }

      console.log('passei do if')
        await connection.query(`
            INSERT INTO  
                customers(name, phone, cpf, birthday)
            VALUES
                ($1, $2, $3, $4);
        `,[name, phone, cpf, birthday]);

        console.log('passei da segunda validação')
        return res.sendStatus(201);
    } catch (error) {
        
        return res.sendStatus(500);
    }
}

export async function allClients (req,res){

    try {

        let clients;
        const searchCpf= req.query.cpf;
        const {id} = req.params

        if(id){
            let client = await connection.query(`
            SELECT * FROM 
                customers 
            WHERE 
                id=$1`,
            [id])

            return res.status(200).send(client.rows);
        }
        if(searchCpf){
            clients = await connection.query(` SELECT * FROM customers  WHERE lower(cpf) LIKE lower($1)`,[`${searchCpf}%`])
                
            return res.status(200).send(clients.rows);
        }
        
        else{
            clients = await connection.query(`
            SELECT * FROM
                customers
            ;
        `)
        return res.status(200).send(clients.rows)
        }

    } catch (error) {

        return res.sendStatus(500)
        
    }
}

export async function updtadeClient (req,res){

    try {
        const { id } = req.params;
        const { phone, cpf, birthday, name} = req.body
        
        
        const client = await connection.query(`
            SELECT * FROM 
                customers
            WHERE
                id=$1
        `, [id]);

        if(client.rows.length === 0){
            return res.status(404).send('Id não encontrado')
        }

        const verificationCpf = await connection.query(`
            SELECT * FROM
                customers
            WHERE
                cpf=$1;
        `,[cpf])

        if(verificationCpf.rows.length !=0 && (verificationCpf.rows[0].id != id)){
            return res.status(409).send('dados inválidos')
        }
        await connection.query(`
            UPDATE customers SET name=$1,phone=$2,birthday=$3,cpf=$4 WHERE id=$5;
            
        `, [name,phone, birthday,cpf,id]);
            return res.status(200).send('atualizei')
        
    } catch (error) {
        
        return res.status(500).send('error')
    }
}

