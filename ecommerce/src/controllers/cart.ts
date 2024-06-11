import { Request, Response } from 'express'
import { Product } from "@prisma/client"
import { NotFoundException } from "../exceptions/not-found"
import { ErrorCode } from "../exceptions/root"
import { ChangeQuantitySchema, CreateCartSchema } from "../schema/cart"
import { prisma } from ".."

export const addItemToCart = async (req, res) => {
	// Check for the existance of the same product in user's cart and 
	// alter the quantity as required
	const validateData = CreateCartSchema.parse(req.body)
	let product: Product;
	try {
		product = await prisma.product.findFirstOrThrow({
			where: {
				id: validateData.productId
			}
		})

	} catch (err) {
		throw new NotFoundException('Product not found!', ErrorCode.PRODUCT_NOT_FOUND)
	}

	let cart;
	const isCartIn = await prisma.cartItem.findFirst({
		where: {
			AND: [
				{ userId: req.user.userId },
				{ productId: validateData.productId, }
			]
		}
	})


	if (isCartIn) {
		isCartIn.quantity += validateData.quantity;
		cart = await prisma.cartItem.update({
			where: {
				id: isCartIn.id
			},
			data: isCartIn,
		})
	} else {
		cart = await prisma.cartItem.create({
			data: {
				userId: req.user.id,
				productId: product.id,
				quantity: validateData.quantity
			}
		})
	}
	res.json(cart)
}

export const deleteItemFromCart = async (req, res) => {
	// Check if user is deleting its own cart item
	await prisma.cartItem.delete({
		where: {
			id: +req.params.id
		}
	})
	res.json({ success: true })
}

export const changeQuantity = async (req: Request, res: Response) => {
	const validateData = ChangeQuantitySchema.parse(req.body)
	const updatedCart = await prisma.cartItem.update({
		where: {
			id: +req.params.id
		},
		data: {
			quantity: validateData.quantity
		}
	})

	res.json(updatedCart)
}

export const getCart = async (req, res) => {
	const cart = await prisma.cartItem.findMany({
		where: {
			userId: req.user.id
		},
		include: {
			product: true
		}
	})
	res.json(cart)
}

