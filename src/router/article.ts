import express from 'express';
import Articles from '../controller/article';
import articleValidator from '../validator/article';
import auth from '../middleware/auth';

const router = express.Router();

// 获取文章列表
router.get('/', Articles.getArticles);

// 创建文章
router.post('/', auth, articleValidator.createArticle, Articles.createArticle);

// 获取文章
router.get('/:articleId', articleValidator.getArticle, Articles.getArticle);

// 更新文章
router.put('/:articleId', auth, articleValidator.updateArticle, Articles.updateArticle);

export default router;