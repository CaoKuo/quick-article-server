
import { Request, Response, NextFunction } from 'express';
import { sign, verify } from '../util/jwt';
import config from '../config';
import { User } from '../model';

const auth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if(!token) {
        return res.status(200).json({
            code: 401,
            msg: '当前用户无权限',
        });
    }

    try {
        const decodedToken: any = await verify(token, config.jwtSecret);

        const currentTime = Date.now();
        const tokenExpiration = decodedToken.exp * 1000;
        const minimumValidity = 60 * 60 * 1000;

        const user = await User.findById(decodedToken.userId);

        if(!user) {
            return res.status(200).json({
                code: 401,
                msg: '当前用户无权限',
            });
        }

        if(tokenExpiration - currentTime < minimumValidity) {
            const newToken = await sign(
                { userId: user._id },
                config.jwtSecret,
                { expiresIn: '1d' },
            );

            res.cookie('token', newToken, { httpOnly: true });
        }

        (req as any).user = user;
        next();
    } catch (error) {
        return res.status(200).json({
            code: 401,
            msg: '当前用户无权限',
        });
    }
};

export default auth;