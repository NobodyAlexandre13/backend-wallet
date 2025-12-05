import express from 'express';
import dotenv from 'dotenv';
import { initDB } from './config/db.js';
import rateLimiter from './middleware/rateLimeter.js';

import transactionsRoute from './routes/transactionsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(rateLimiter)
app.use(express.json())

app.use("/api/transactions/", transactionsRoute);

initDB().then(() => {
    app.listen(5001,()=>{
        console.log('Server running on port ', PORT);
    })
}) 