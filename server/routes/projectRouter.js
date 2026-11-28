const { Router } = require("express");
const {
  getPublicProject,
  createProject,
  listProjects,
  getProject,
  deleteProject,
  updateProject,
  publishProject,
} = require("../controllers/projectController");
const authMiddleWare = require("../middleware/AuthMiddleware");
const { chat } = require("../controllers/chatController");

const projectRouter = Router();

// Public Route
projectRouter.get("/public/:id", getPublicProject);

// Protect all following routes
projectRouter.use(authMiddleWare);

projectRouter.post("/", createProject);
projectRouter.get("/", listProjects);
projectRouter.get("/:id", getProject);
projectRouter.delete("/:id", deleteProject);
projectRouter.put("/:id/files", updateProject);
projectRouter.post("/:id/publish", publishProject);

// Chat
projectRouter.post("/:id/chat", chat);

module.exports = projectRouter;
