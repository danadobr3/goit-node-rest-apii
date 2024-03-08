import express from "express";
import validateBody from "../helpers/validateBody.js";
import validateToken from "../helpers/validateToken.js";
import {
  createUserSchema,
  updateSubscriptionSchema,
} from "../schemas/usersSchemas.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateSubscription,
} from "../controllers/usersControllers.js";

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(createUserSchema), registerUser);
usersRouter.post("/login", validateBody(createUserSchema), loginUser);
usersRouter.post("/logout", validateToken, logoutUser);
usersRouter.get("/current", validateToken, getCurrentUser);
usersRouter.patch(
  "/",
  validateToken,
  validateBody(updateSubscriptionSchema),
  updateSubscription
);

export default usersRouter;