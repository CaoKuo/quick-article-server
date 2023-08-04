import express, { Request, Response, NextFunction } from 'express';
import { User } from "../model";
import config from '../config';
import { sign } from '../util/jwt'
import { Secret } from 'jsonwebtoken'

class Users {
    // 登录
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const user = (req as any).user.toJSON();

            if(!user) {
                return res.status(401).json({
                    code: -1,
                    msg: 'user not find'
                })
            }

            const jwtSecret: Secret = config.jwtSecret as Secret;

            const token = await sign(
                { userId: user._id },
                jwtSecret as Secret,
                { expiresIn: '1d' }
            );

            delete user.password;

            // 将令牌写入 Cookie
            res.cookie('token', token, { httpOnly: true });

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
                code: 0,
                data: {
                    ...user,
                    token,
                }
            })
        } catch (error) {
            next(error)
        }
    }
    // 注册
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
                code: 0,
                data: {
                    user: ret,
                }
            });
        } catch (error) {
            next(error)
        }
    }
    // 获取当前用户信息
    async getCurrentUser(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(200).json({
                code: 0,
                data: {
                    user: (req as any).user
                }
            })
        } catch (error) {
            next(error);
        }
    }
    // 更新用户信息
    async updateCurrentUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userInfo = req.body.user;

            const userId = (req as any).user._id;

            const updatedUser = await User.findOneAndUpdate(
                { _id: userId },
                userInfo,
                { new: true }
            )

            if(!updatedUser) {
                res.status(404).json({
                    code: -1,
                    msg: 'User not found'
                })
            }

            console.log('Updated user:', updatedUser);

            res.status(200).json({
                code: 0,
                data: {
                    user: updatedUser,
                }
            })
        } catch (error) {
            next(error);
        }
    }
}

export default new Users();