import express from 'express';
import Users from '../controller/user';
import userValidator from '../validator/user';
import auth from '../middleware/auth';

const router = express.Router();

// 用户登录
router.post('/users/login', userValidator.login, Users.login);

// 用户注册
router.post('/users', userValidator.register, Users.register);

// 获取所有的用户列表
router.get('/user/list', auth, userValidator.getUserList, Users.getUserList);

// 获取当前登录用户
router.get('/user', auth, Users.getCurrentUser);

// 更新用户信息
router.put('/user', auth, Users.updateCurrentUser);

// 删除用户
router.delete('/user/:userId', auth, userValidator.deleteUser, Users.deleteUser);

export default router;