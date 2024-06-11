import { Request, Response } from 'express'
import { prisma } from '..'
import { NotFoundException } from '../exceptions/not-found';
import { ErrorCode } from '../exceptions/root';

export const createProduct = async (req: Request, res: Response) => {
	const product = await prisma.product.create({
		data: {
			...req.body,
			tags: req.body.tags.join(',')
		}
	})

	res.json(product);
}

export const updateProduct = async (req: Request, res: Response) => {
	try {
		const product = req.body;
		if (product.tags) {
			product.tags = product.tags.join(',')
		}
		console.log('product: ', product);
		const updateProduct = await prisma.product.update({
			where: {
				id: +req.params.id
			},
			data: product
		})
		res.json(updateProduct)

	} catch (err) {
		throw new NotFoundException('Product not found.', ErrorCode.PRODUCT_NOT_FOUND)
	}

}

export const deleteProduct = async (req, res) => {
	try {
		await prisma.product.delete({
			where: {
				id: +req.params.id
			}
		})

	} catch (err) {
		throw new NotFoundException('Product not found.', ErrorCode.PRODUCT_NOT_FOUND)
	}

}

export const listProducts = async (req: Request, res) => {
	const count = await prisma.product.count();
	const products = await prisma.product.findMany({
		skip: +req.query.skip || 0,
		take: 5
	})
	res.json({
		count, data: products
	})

}

export const getProductById = async (req, res) => {
	try {
		const product = await prisma.product.findFirstOrThrow({
			where: {
				id: +req.params.id
			}
		})
		res.json(product);
	} catch (err) {
		throw new NotFoundException('Product not found.', ErrorCode.PRODUCT_NOT_FOUND)
	}
}

export const searchProducts = async (req, res) => {
	const products = await prisma.product.findMany({
		where: {
			name: {
				search: req.query.q.toString()
			},
			description: {
				search: req.query.q.toString()
			},
			tags: {
				search: req.query.q.toString()
			},
		}
	})
	res.json(products)
}