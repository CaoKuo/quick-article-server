import express, { Request, Response, NextFunction } from 'express';
import { User } from "../model";
import config from '../config';
import { sign } from '../util/jwt'
import { Secret } from 'jsonwebtoken'

class Users {
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const user = (req as any).user.toJSON();

            if(!user) {
                return res.status(401).json({
                    code: -1,
                    msg: 'user not find'
                })
            }
            
            // const token = await sign(
            //     { userId: user.user_id },
            //     config.jwtSecret,
            //     { expiresIn: '2d' }
            // )

            delete user.password;

            // 将令牌写入 Cookie
            // res.cookie('token', token, { httpOnly: true });

            /**
             * 后续可以从请求的 Cookie 中获取令牌
             * const token = req.cookies.token;

                if (!token) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }

                // 验证令牌
                jwt.verify(token, 'your_secret_key', (err, decoded) => {
                    if (err) {
                        return res.status(401).json({ message: 'Unauthorized' });
                    }

                    // 验证成功，可以使用 decoded 中的用户信息
                    res.json({ message: 'Authorized', user: decoded });
                });
             */

            return res.status(200).json({
                ...user,
                // token,
            })
        } catch (error) {
            next(error)
        }
    }
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            let user = new User(req.body.user);

            await user.save();

            const { username, email, bio, image } = user;
            
            let ret = {
                username,
                email,
                bio,
                image
            }

            res.status(201).json({
                user: ret,
            });
        } catch (error) {
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