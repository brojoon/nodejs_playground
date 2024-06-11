import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";
import { errorHandler } from "../error-handler";
import { addAddress, changeUserRole, deleteAddress, getUserById, listAddress, listUsers, updateUser } from "../controllers/users";

const usersRoutes = Router();
usersRoutes.get('/', [authMiddleware, adminMiddleware], errorHandler(listUsers))
usersRoutes.get('/:id', [authMiddleware, adminMiddleware], errorHandler(getUserById))
usersRoutes.get('/address', [authMiddleware], errorHandler(listAddress))

usersRoutes.post('/address', [authMiddleware], errorHandler(addAddress))

usersRoutes.put('/', [authMiddleware], errorHandler(updateUser))
usersRoutes.put('/:id/role', [authMiddleware, adminMiddleware], errorHandler(changeUserRole))

usersRoutes.delete('/address/:id', [authMiddleware], errorHandler(deleteAddress))

export default usersRoutes;