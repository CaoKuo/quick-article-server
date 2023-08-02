import express from 'express';
import Users from '../controller/user';
import userValidator from '../validator/user';

const router = express.Router();

// 用户登录
router.post('/users/login', userValidator.login, Users.login);

// 用户注册
router.post('/users', userValidator.register,Users.register);

// 获取当前登录用户
router.get('/user', Users.getCurrentUser);

export default router;