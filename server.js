import express from 'express';
import dotenv from 'dotenv';
import { sql } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json())

async function initDB(){
    try {
        await sql`CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`
        console.log("Base de dados criado com sucesso")
    } catch (error) {
        console.log("Erro ao inicializar a DB", error)
        process.exit(1)
    }
}

app.get("/api/transactions/:user_id", async(req, res) =>{
    try {
        const { user_id} =  req.params;

        const select_transaction = await sql`
            SELECT * FROM transactions WHERE user_id = ${user_id} ORDER BY created_at DESC
        `;

        res.status(200).json(select_transaction);
    } catch (error) {
        console.log("Erro ao pegar transação", error);
        res.status(500).json({message: "Erro interno no servidor"})
    }
})

app.post("/api/transactions", async(req, res) => {
    try {
        const { title,amount,category,user_id} = req.body;

        if(!title || !amount || !category || !user_id){
            return res.status(400).json({message: "Precisas preencher todos os campaos"});
        }

        const transaction = await sql`
            INSERT INTO transactions(user_id, title, amount, category)
            VALUES (${user_id}, ${title}, ${amount}, ${category})
        `
        console.log(transaction);
        res.status(201).json(transaction[0]);
    } catch (error) {
        console.log("Erro ao criar transação", error);
        res.status(500).json({message: "Erro interno no servidor"})
    }
})

app.delete("/api/transactions/:id", async(req, res) =>{
    try {
        const { id } =  req.params;
        
        if(isNaN(parseInt(id))){
            return res.status(400).json({ message: "ID invalido"})
        }

        const delete_transaction = await sql`
            DELETE FROM transactions WHERE id = ${id} RETURNING *
        `;
        
        if(delete_transaction.length === 0){
            return res.status(404).json({message: "Transação não encontrada"});
        }

        res.status(200).json({message: "Transação eliminada com sucesso"});
    } catch (error) {
        console.log("Erro ao eliminar transação", error);
        res.status(500).json({message: "Erro interno no servidor"})
    }
})

initDB().then(() => {
    app.listen(5001,()=>{
        console.log('Server running on port ', PORT);
    })
})