import express from 'express';
import UserRouter from './user'
import ArticleRouter from './article';

const router = express.Router();

// 用户相关路由
router.use(UserRouter);

// 文章相关
router.use('/articles', ArticleRouter);

export default router;

