import express from 'express';
import Users from '../controller/user';

const router = express.Router();

// 用户登录
router.post('/users/login', Users.login);

// 获取当前登录用户
router.get('/user', Users.getCurrentUser);

export default router;