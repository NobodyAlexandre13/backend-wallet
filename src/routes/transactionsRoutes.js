import express from 'express';

import { 
    getTransactionsByUserId, 
    deleteTransactions, 
    createTransactions,
    getSummaryUserId
} from '../controllers/transactionsControllers.js';

const router = express.Router();


router.get("/:user_id", getTransactionsByUserId);

router.post("/", createTransactions);

router.delete("/:id", deleteTransactions);

router.get("/summary/:user_id", getSummaryUserId);


export default router;