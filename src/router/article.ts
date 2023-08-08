import express from 'express';
import Articles from '../controller/article';
import articleValidator from '../validator/article';
import auth from '../middleware/auth';

const router = express.Router();

// 获取文章列表
router.get('/', Articles.getArticles);

// 获取用户的文章列表
router.get('/feed', articleValidator.getFeedArticles, Articles.getFeedArticles);

// 获取文章
router.get('/:articleId', articleValidator.getArticle, Articles.getArticle);

// 创建文章
router.post('/', auth, articleValidator.createArticle, Articles.createArticle);

// 更新文章
router.put('/:articleId', auth, articleValidator.updateArticle, Articles.updateArticle);

// 删除文章
router.delete('/:articleId', auth, articleValidator.deleteArticle, Articles.deleteArticle);

export default router;