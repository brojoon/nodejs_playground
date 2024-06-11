import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import { JWT_SECRET } from "../secrets";
import { prisma } from "..";
import jwt from 'jsonwebtoken';

const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
	const token = req.headers.authorization;
	// 1. extract the token from header
	console.log('hahahha');

	// 2. if token is not present, throw an error of unauthorized
	if (!token) {
		// next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
	}
	try {
		// 3. if the token is present, verify that token and extract the payload
		const payload = jwt.verify(token, JWT_SECRET) as any;
		// 4. to get the user from the payload
		const user = await prisma.user.findFirst({ where: { id: payload?.userId } })
		if (!user) {
			// next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED))
		}
		req.user = user;
		next();
	} catch (error) {
		// next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED))
	}
	console.log('clear')

}

export default authMiddleware;