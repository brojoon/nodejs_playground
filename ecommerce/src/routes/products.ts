import { Router } from "express";
import { errorHandler } from "../error-handler";
import { createProduct, deleteProduct, getProductById, listProducts, searchProducts, updateProduct } from "../controllers/products";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";

const productsRoutes = Router()

productsRoutes.get('/', [authMiddleware, adminMiddleware], errorHandler(listProducts))
productsRoutes.get('/search', [adminMiddleware], errorHandler(searchProducts))
productsRoutes.get('/:id', [authMiddleware, adminMiddleware], errorHandler(getProductById))

productsRoutes.post('/', [authMiddleware, adminMiddleware], errorHandler(createProduct))

productsRoutes.put('/:id', [authMiddleware, adminMiddleware], errorHandler(updateProduct))

productsRoutes.delete('/:id', [authMiddleware, adminMiddleware], errorHandler(deleteProduct))

export default productsRoutes