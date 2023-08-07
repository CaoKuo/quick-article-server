import { Request, Response, NextFunction } from 'express';
import { User, UserFollow } from '../model';

class Profiles {
    // 获取指定的用户信息
    async getProfilesUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.userId;

            const userInfo = await User.findById(userId);

            const currentUserId = (req as any).user._id;

            // 查询是否已经存在关注关系
            const existingFollow = await UserFollow.findOne({
                follower: currentUserId,
                following: userId,
            });

            if(!userInfo) {
                return res.status(404).json({
                    code: -1,
                    msg: '用户不存在',
                });
            }

            const { username, bio, image } = userInfo;

            const profile = {
                username,
                bio,
                image,
                following: existingFollow ? true : false,
            };

            res.status(200).json({
                code: 0,
                data: {
                    profile,
                },
            });
        } catch (error) {
            next(error);
        }
    }
    // 关注用户
    async followUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.userId;

            const userInfo = await User.findById(userId);

            const currentUserId = (req as any).user._id;

            // 查询是否已经存在关注关系
            const existingFollow = await UserFollow.findOne({
                follower: currentUserId,
                following: userId,
            });

            if(existingFollow) {
                return res.status(404).json({
                    code: -1,
                    msg: '已关注该用户，无需重复关注',
                });
            }

            if(!userInfo) {
                return res.status(404).json({
                    code: -1,
                    msg: '用户不存在',
                });
            }

            if(currentUserId == userId) {
                return res.status(404).json({
                    code: -1,
                    msg: '无法关注自身',
                });
            }

            const { username, bio, image } = userInfo;

            const followInfo = new UserFollow({
                follower: currentUserId,
                following: userId,
            });

            followInfo.save();

            const profile = {
                username,
                bio,
                image,
                following: existingFollow ? true : false,
            };

            res.status(200).json({
                code: 0,
                data: {
                    profile,
                },
            });
        } catch (error) {
            next(error);
        }
    }
    // 取消关注
    async unFollowUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.userId;

            const userInfo = await User.findById(userId);

            const currentUserId = (req as any).user._id;

            // 查询是否已经存在关注关系
            const existingFollow = await UserFollow.findOne({
                follower: currentUserId,
                following: userId,
            });

            if(existingFollow === null) {
                return res.status(400).json({
                    code: -1,
                    msg: '当前用户已取消关注',
                });
            }

            if(!userInfo) {
                return res.status(404).json({
                    code: -1,
                    msg: '用户不存在',
                });
            }

            if(currentUserId == userId) {
                return res.status(404).json({
                    code: -1,
                    msg: '无法取消关注自身',
                });
            }

            const { username, bio, image } = userInfo;

            await UserFollow.findByIdAndRemove(existingFollow._id);

            const profile = {
                username,
                bio,
                image,
                following: false,
            };

            res.status(200).json({
                code: 0,
                data: {
                    profile,
                },
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new Profiles();