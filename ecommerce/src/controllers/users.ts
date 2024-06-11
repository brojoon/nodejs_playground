import { Address, User } from "@prisma/client"
import { NotFoundException } from "../exceptions/not-found"
import { ErrorCode } from "../exceptions/root"
import { AddressSchema, UpdateUserSchema } from "../schema/users"
import { prisma } from ".."
import { BadRequestsException } from "../exceptions/bad-requests"

export const addAddress = async (req, res) => {
	AddressSchema.parse(req.body)


	const address = await prisma.address.create({
		data: {
			...req.body,
			userId: req.user.id
		}
	})
	res.json(address);
}

export const deleteAddress = async (req, res) => {
	try {
		await prisma.address.delete({
			where: {
				id: +req.params.id
			}
		})
	} catch (err) {
		throw new NotFoundException('Address not found.', ErrorCode.ADDRESS_NOT_FOUND)
	}

}

export const listAddress = async (req, res) => {
	const addresses = await prisma.address.findMany({
		where: {
			userId: req.user.id
		}
	})
	res.json(addresses);
}

export const updateUser = async (req, res) => {
	const validateData = UpdateUserSchema.parse(req.body)
	let shippingAddress: Address;
	let billingAddress: Address;
	if (validateData.defaultShippingAddress) {
		try {
			shippingAddress = await prisma.address.findFirstOrThrow({
				where: {
					id: validateData.defaultShippingAddress
				}
			})

		} catch (error) {
			throw new NotFoundException('Address not found.', ErrorCode.ADDRESS_NOT_FOUND)
		}
		if (shippingAddress.userId != req.user.id) {
			throw new BadRequestsException('Address does not belong to user', ErrorCode.ADDRESS_DOES_NOT_BELONG)
		}
	}

	if (validateData.defaultBillingAddress) {
		try {
			billingAddress = await prisma.address.findFirstOrThrow({
				where: {
					id: validateData.defaultBillingAddress
				}
			})

		} catch (error) {
			throw new NotFoundException('Address not found.', ErrorCode.ADDRESS_NOT_FOUND)
		}
		if (billingAddress.userId != req.user.id) {
			throw new BadRequestsException('Address does not belong to user', ErrorCode.ADDRESS_DOES_NOT_BELONG)
		}
	}

	const updatedUser = await prisma.user.update({
		where: {
			id: req.user.id
		},
		data: validateData
	})

	res.json(updatedUser);

}

export const listUsers = async (req, res) => {
	const users = await prisma.user.findMany({
		skip: +req.query.skip || 0,
		take: 5
	})
	res.json(users)
}

export const getUserById = async (req, res) => {
	try {
		const user = await prisma.user.findFirstOrThrow({
			where: {
				id: +req.params.id
			},
			include: {
				addresses: true
			}
		})
		res.json(user)
	} catch (err) {
		throw new NotFoundException('User not found.', ErrorCode.USER_NOT_FOUND)
	}

}

export const changeUserRole = async (req, res) => {
	try {
		const user = await prisma.user.update({
			where: {
				id: +req.params.id
			},
			data: {
				role: req.body.role
			}
		})
		res.json(user)
	} catch (err) {
		throw new NotFoundException('User not found.', ErrorCode.USER_NOT_FOUND)
	}
}