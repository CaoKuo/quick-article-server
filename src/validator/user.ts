import { body } from 'express-validator';
import { validate } from '../middleware/validate';
import { User } from '../model';
import { md5 } from '../util/md5';

const login = [
    validate([
        body('user.email').notEmpty().withMessage('邮箱不能为空')
            .isEmail().withMessage('邮箱格式不正确'),
        body('user.password').notEmpty().withMessage('密码不能为空'),
    ]),
    validate([
        body('user.email').custom(async (email, { req }) => {
            const user = await User.findOne({ email })
                .select(['email', 'username', 'bio', 'image', 'password'])
                .exec();

            if(!user) {
                return Promise.reject(new Error('用户不存在'));
            }

            req.user = user;
        }),
    ]),
    validate([
        body('user.password').custom(async (password, { req }) => {
            // req.user.password --> 上面获取到的用户信息
            if(md5(password) !== req.user.password) {
                return Promise.reject(new Error('密码错误'));
            }
        }),
    ]),
];

const register = validate([
    body('user.email')
        .notEmpty().withMessage('邮箱不能为空')
        .isEmail().withMessage('邮箱格式不正确')
        .bail() // 如果上面已经出现错误则停止执行下面的代码
        .custom(async email => { // 自定义校验规则
            const user = await User.findOne({ email });
            if (user) {
                return Promise.reject(new Error('邮箱已存在'));
            }
        }),
    body('user.username')
        .notEmpty().withMessage('用户名不能为空'),
    // .custom(async username => {
    //     const user = await User.findOne({ username });
    //     if(user) {
    //         return Promise.reject(new Error('用户名已存在'));
    //     }
    // }),
    body('user.password').notEmpty().withMessage('密码不能为空'),
]);

export default {
    login,
    register,
};