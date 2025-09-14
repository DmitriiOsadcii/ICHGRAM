import { Request, Response, NextFunction } from "express"
import * as jswb from "../functions/jsonwebtoken"
import HttpExeption from "../utils/HttpExeption"
import User, { UserDocument } from "../db/models/User"
import { AunthReq } from "../typescript/interfaces"

const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { authorization } = req.headers
    if (!authorization) throw HttpExeption(401, `Authorization header is missing !`)

    const [bearer, token] = authorization.split(" ")
    if (bearer !== "Bearer" ) throw HttpExeption(401, `Bearer is missing`)
    try {
        const id = jswb.verifyToken(token)
        const user: UserDocument | null = await User.findById(id)

        if (!user || !user.token || user.token !== token) { return next(HttpExeption(401, "User not found")) }
        (req as AunthReq).user = user
        next()
    } catch (error) {
        if (error instanceof Error) {
            throw HttpExeption(401, error.message)
        }
    }
}

export default authenticate;