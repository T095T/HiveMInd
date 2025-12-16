import dotenv from "dotenv";
dotenv.config();
import express, { urlencoded } from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./ingest/index.js";
import workspaceRouter from "./routes/workspaceRoutes.js";
import  { protect } from "./middleware/authMiddleware.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(clerkMiddleware());

//route
app.get("/", (req, res) => res.send("Server is Live..."));
//inngest route
app.use("/api/inngest", serve({ client: inngest, functions }));

//Route --> middleware --> controller
app.use('/api/workspaces',protect,workspaceRouter)

app.listen(port, () => console.log(`Port running on ${port}`));
