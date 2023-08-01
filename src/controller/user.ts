import express, { Request, Response, NextFunction } from 'express';
import { User } from "../model";

class Users {
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            console.log('req===', req)
            // res.status(200).json({
            //     user: 'user======'
            // })
        } catch (error) {
            console.log('eor===', error)
            next(error)
        }
    }
    async getCurrentUser(req: Request, res: Response, next: NextFunction) {
        try {
            console.log(req.headers);
            res.send('get /user')
        } catch (error) {
            next(error);
        }
    }
}

export default new Users();