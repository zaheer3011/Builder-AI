const { Router } = require("express");
const {
  register,
  login,
  logout,
  me,
} = require("../controllers/authController");
const { authMiddleWare } = require("../middleware/AuthMiddleware");

const authRouter = Router();

authRouter.post("/resigter", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/me", authMiddleWare, me);

export default authRouter;
