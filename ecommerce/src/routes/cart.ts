import { Router } from "express";
import { addItemToCart, changeQuantity, deleteItemFromCart, getCart } from "../controllers/cart";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";

const cartRoutes = Router();

cartRoutes.get('/', [authMiddleware], errorHandler(getCart))
cartRoutes.post('/', [authMiddleware], errorHandler(addItemToCart))
cartRoutes.put('/:id', [authMiddleware], errorHandler(changeQuantity))
cartRoutes.delete('/:id', [authMiddleware], errorHandler(deleteItemFromCart))


export default cartRoutes
