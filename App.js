import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors';
import express from 'express';
import {connectDB} from './config/connectdb.js'
import userRoutes from './routes/userRoutes.js'
const app = express();



app.use(cors());
const port = process.env.PORT || 8080;
const DATABASE_URL = process.env.DATABASE_URL;

connectDB(DATABASE_URL);


app.use(express.json());

app.use("/api/user", userRoutes)

app.listen(port, ()=> {
    console.log(`server listing at ${process.env.PORT}`);
})
