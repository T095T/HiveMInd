import express from "express"
import { addMembers, getUserWorkspaces } from "../controllers/workspaceController.js";

const workspaceRouter = express.Router();

workspaceRouter.get('/',getUserWorkspaces)

workspaceRouter.post('/add-member',addMembers)


export default workspaceRouter