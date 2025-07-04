import { Response } from "express";
import { StatusCodes } from "http-status-codes";

export class CustomResponse
{
    static success<T>(res: Response, data: T) {
        res.status(StatusCodes.OK).json(data);
    }
    static created<T>(res: Response, data: T) {
        res.status(StatusCodes.CREATED).json(data);
    }
}