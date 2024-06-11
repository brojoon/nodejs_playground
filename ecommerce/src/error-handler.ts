import { NextFunction, Request, Response } from "express"
import { ErrorCode, HttpException } from "./exceptions/root"
import { InternalException } from "./exceptions/internal-exception"
import { ZodError } from "zod"
import { BadRequestsException } from "./exceptions/bad-requests"

export const errorHandler = (method: Function) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		console.log('errorHandler call');
		try {
			await method(req, res, next)
		} catch (error: HttpException | any) {
			let exception: HttpException;
			console.log('typeof: ', typeof error); 
			if (error instanceof HttpException) {
				exception = error;
			} else {
				if (error instanceof ZodError) {
					exception = new BadRequestsException('Unprocessable entity', ErrorCode.UNPROCESSABLE_ENTITY);
				} else {
					exception = new InternalException('Something went wrong!', error, ErrorCode.INTERNAL_EXCEPTION);
				}
			}

			console.log('error: ', error);
			next(exception)
		}
		console.log('errorHandler done');
	}
}