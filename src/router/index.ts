import express from 'express';
import UserRouter from './user'

const router = express.Router();

// 用户相关路由
router.use(UserRouter);

export default router;

