import { sql } from '../config/db.js';

export async function getTransactionsByUserId(req, res) {
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
}

export async function createTransactions(req, res) {
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
}

export async function deleteTransactions(req, res) {
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
}

export  async function getSummaryUserId(req, res) {
    try {
        const {user_id} = req.params;

        const balanceResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as balance FROM transactions 
            WHERE user_id = ${user_id}
        `

        const incomeResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as income FROM transactions
            WHERE user_id = ${user_id} AND amount > 0
        `

        const expenseResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as expense FROM transactions
            WHERE user_id = ${user_id} AND amount < 0
        `

        res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expense: expenseResult[0].expense
        });

    } catch (error) {
        console.log("Erro ao eliminar transação", error);
        res.status(500).json({message: "Erro interno no servidor"})
    }
}