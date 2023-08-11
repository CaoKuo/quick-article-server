import express, { Request, Response, NextFunction } from 'express';
import { User } from '../model';
import config from '../config';
import { sign } from '../util/jwt';
import { Secret } from 'jsonwebtoken';

class Users {
    // 登录
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const user = (req as any).user.toJSON();

            if(!user) {
                return res.status(401).json({
                    code: -1,
                    msg: 'user not find',
                });
            }

            const jwtSecret: Secret = config.jwtSecret as Secret;

            const token = await sign(
                { userId: user._id },
                jwtSecret as Secret,
                { expiresIn: '1d' },
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
                },
            });
        } catch (error) {
            next(error);
        }
    }
    // 注册
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const user = new User(req.body.user);

            user.role = 0;

            await user.save();

            const { username, email, bio, image } = user;
            
            const ret = {
                username,
                email,
                bio,
                image,
            };

            res.status(201).json({
                code: 0,
                data: {
                    user: ret,
                },
            });
        } catch (error) {
            next(error);
        }
    }
    // 获取所有的用户列表
    async getUserList(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                pageNum = 1,
                pageSize = 10,
                email,
                username,
                role,
            } = req.query;

            const skipCount = (Number(pageNum) - 1) * Number(pageSize);

            const filter: { [key: string]: any } = {};
            
            if(email) {
                filter.email = email;
            }
            console.log(role, typeof role);
            if(role != ''  && role != undefined && role != null) {
                filter.role = role;
            }

            if(username) {
                filter.username = {
                    $regex: new RegExp((username as string), 'i'),
                };
            }

            console.log(filter);

            const users = await User.find(filter)
                .skip(skipCount)
                .limit(Number(pageSize))
                .sort({
                    createdAt: -1,
                });

            const total = await User.countDocuments(filter);

            res.status(200).json({
                code: 0,
                data: {
                    users,
                    total,
                },
            });

        } catch (error) {
            next(error);
        }
    }
    // 获取当前用户信息
    async getCurrentUser(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(200).json({
                code: 0,
                data: {
                    user: (req as any).user,
                },
            });
        } catch (error) {
            next(error);
        }
    }
    // 更新用户信息
    async updateCurrentUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userInfo = req.body.user;

            const userId = (req as any).user._id;

            const userRole = (req as any).user.role;

            const updateUserId = userInfo._id ? userInfo._id : '';

            if(userId !== updateUserId && userRole != 2) {
                return res.status(400).json({
                    code: -1,
                    msg: '用户无权限',
                });
            }

            const updatedUser = await User.findOneAndUpdate(
                { _id: updateUserId },
                userInfo,
                { new: true },
            );

            if(!updatedUser) {
                res.status(404).json({
                    code: -1,
                    msg: 'User not found',
                });
            }

            console.log('Updated user:', updatedUser);

            res.status(200).json({
                code: 0,
                data: {
                    user: updatedUser,
                },
            });
        } catch (error) {
            next(error);
        }
    }
    // 删除用户信息
    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.userId;

            await User.findByIdAndDelete(userId);

            res.status(200).json({
                code: 0,
                msg: '删除成功',
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new Users();