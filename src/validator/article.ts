import { body } from 'express-validator';
import { validate, isValidObjectId } from '../middleware/validate';
import { Request, Response, NextFunction } from 'express';
import { Article } from '../model';


const getFeedArticles = validate([
    body('userId').notEmpty().withMessage('用户ID不能为空'),
    isValidObjectId(['body'], 'userId'),
]);

const getArticle = validate([
    isValidObjectId(['params'], 'articleId'),
]);

const createArticle = validate([
    body('article.title').notEmpty().withMessage('文章标题不能为空'),

    body('article.description').notEmpty().withMessage('文章摘要不能为空'),

    body('article.body').notEmpty().withMessage('文章内容不能为空'),
]);

const updateArticle = [
    validate([
        isValidObjectId(['params'], 'articleId'),
    ]),
    async (req: Request, res: Response, next: NextFunction) => {
        const articleId = req.params.articleId;
        const article = await Article.findById(articleId);

        (req as any).article = article;

        if(!article) {
            return res.status(404).json({
                code: -1,
                msg: '文章未找到',
            });
        }

        next();
    },

    async (req: Request, res: Response, next: NextFunction) => {
        if((req as any).user._id.toString() !== (req as any).article.author.toString()) {
            return res.status(403).json({
                code: -1,
                msg: '文章归属错误',
            });
        }
        next();
    },
];

const deleteArticle = [
    validate([
        isValidObjectId(['params'], 'articleId'),
    ]),
    async (req: Request, res: Response, next: NextFunction) => {
        const articleId = req.params.articleId;

        const article = await Article.findById(articleId);

        (req as any).article = article;

        if(!article) {
            return res.status(404).json({
                code: -1,
                msg: '文章未找到',
            });
        }

        next();
    },
    async (req: Request, res: Response, next: NextFunction) => {
        if((req as any).user._id.toString() !== (req as any).article.author.toString()) {
            return res.status(403).json({
                code: -1,
                msg: '文章归属错误',
            });
        }
        next();
    },
];

export default {
    getFeedArticles,
    getArticle,
    createArticle,
    updateArticle,
    deleteArticle,
};