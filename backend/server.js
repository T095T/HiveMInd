import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors"
import { clerkMiddleware } from '@clerk/express'
dotenv.config();

const app = express()
const port = 3000

app.use(express.json());
app.use(cors())
app.use(urlencoded({ extended: true }))
app.use(clerkMiddleware())


//route
app.get('/',(req,res)=> res.send("Server is Live..."));
app.listen(port,()=>console.log(`Port running on ${port}`))