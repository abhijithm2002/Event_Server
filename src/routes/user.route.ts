import { Router } from "express";
import UserController from "../controller/user.controller.js";

const router = Router();

const userController = new UserController()

router.post('/userSignup', userController.userSignup.bind(userController));
router.post('/userLogin', userController.userLogin.bind(userController));
router.post('/createEvent', userController.userLogin.bind(userController));

export const userRoutes = router;