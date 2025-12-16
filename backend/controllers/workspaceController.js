import { prisma } from "../configs/prisma";

export const getUserWorkspaces = async (req, res) => {
  try {
    const { userId } = await req.auth();

    const workspaces = await prisma.workspace.findMany({
      where: {
        members: {
          some: { userId: userId },
        },
      },
      include: {
        members: {
          include: { user: true },
        },
        projects: {
          include: {
            tasks: {
              include: {
                assignee: true,
                comments: {
                  include: { user: true },
                },
              },
            },
            members: {
              include: { user: true },
            },
          },
        },
        owner: true,
      },
    });

    res.json(workspaces);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch workspaces" });
  }
};

//add member to workspace

export const addMembers = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { email, role, workspaceId, message } = req.body;
    //check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      //check if user present
      return res.status(500).json({ message: "User Doesn't exist" });
    }
    if (!workspaceId || !role) {
      //check if workspace / role comes form req.body
      return res.status(400).json({ message: "Missing required parameters" });
    }
    if (!["ADMIN", "MEMBER"].includes(role)) {
      //check if role is valid
      return res.status(400).json({ message: "Invalid Role" });
    }
    //fetching workspace
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: { members: true },
    });
    if (!workspace) {
      //check if workspace present
      return res.status(500).json({ message: "Workspace doesn't exist" });
    }
    //check if creator has admin role
    if (
      !workspace.members.find(
        (member) => member.userId === userId && member.role === "ADMIN"
      )
    ) {
      return res
        .status(401)
        .json({ message: "You dont have admin priviledges" });
    }
    //if user is already a member
    const existingMember = workspace.members.find((member)=>member.userId ===userId);
    if(existingMember){
      return res.status(400).json({message:"User is already a member"});
    }
    //if user not member
    const member = await prisma.workspaceMember.create({
        data:{
            userId:user.id,
            role,
            workspaceId,
            message
        }
    })
    res.json({member,message:"member added successfully"});
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch workspaces" });
  }
};
