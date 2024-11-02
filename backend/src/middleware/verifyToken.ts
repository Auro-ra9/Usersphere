import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

export const verifyToken = async(req:Request, res:Response, next:NextFunction):Promise<void> => {
    try {
        //first we need to get token from the cookie
        const token = req.cookies.token;


        if (!token) {
            res.status(404).json({ message: "Token is missing" });
            return;
        }

        //verify the token we get
        let jwtSecretKey = process.env.JWT_SECRET || '';
        const decodedToken = await jwt.verify(token, jwtSecretKey);
        if (decodedToken) {
            next();
        } else {
            res.status(401).json({ message: "Invalid token" });
            return;
        }
        
    } catch (error:any) {
        res.status(500).json({ error:error.message });
    }
}