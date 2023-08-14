import express from 'express';
import UserRouter from './user';
import ArticleRouter from './article';
import ProfilesRouter from './profiles';
import TagsRouter from './tag';

const router = express.Router();

// 用户相关路由
router.use(UserRouter);

// 文章相关
router.use('/articles', ArticleRouter);

// 关注相关
router.use('/profiles', ProfilesRouter);

// 标签相关
router.use('/tags', TagsRouter);

export default router;

