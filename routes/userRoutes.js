import express from "express";
const router = express.Router();
import UserController from "../controllers/userController.js";
import checkUserAuth from "../middlewares/auth-middleware.js";

// Route Level Middleware - To Protect Route
router.use('/changepassword', checkUserAuth)
router.get('/loggeduser', checkUserAuth)
// Public Routes
router.post('/register', UserController.userRegisteration)
router.post('/login', UserController.userLogin)


// Protected Routes
router.post('/changepassword', UserController.changeUserPassword)
router.get('/loggeduser', UserController.loggedUser)
export default router