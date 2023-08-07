import { Request, Response, NextFunction } from 'express';
import { Article, User } from '../model';

class Articles {
    // 获取文章列表
    async getArticles(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                pageSize = 10,
                pageNum = 1,
                tag,
                author,
            } = req.query;

            const skipCount = (Number(pageNum) - 1) * Number(pageSize);

            const filter: { [key: string]: any } = {};
            if (tag) {
                filter.tagList = tag;
            }

            if (author) {
                const user: any = await User.findOne({ username: author });

                filter.author = user ? user._id : null;
            }

            const articlesQuery = Article.find(filter)
                .populate('author', '-_id')
                .skip(skipCount)
                .limit(Number(pageSize))
                .sort({
                    createdAt: -1,
                });

            const [articles, articlesCount] = await Promise.all([
                articlesQuery.exec(),
                Article.countDocuments(filter),
            ]);

            res.status(200).json({
                code: 0,
                data: {
                    articles,
                    total: articlesCount,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    // 获取文章
    async getArticle(req: Request, res: Response, next: NextFunction) {
        try {
            const article = await Article.findById(req.params.articleId).populate('author', '-_id');
            if(!article) {
                return res.status(400).json({
                    code: -1,
                    msg: '未找到该文章',
                });
            }

            res.status(200).json({
                code: 0,
                data: article,
            });
        } catch (error) {
            next(error);
        }
    }

    // 创建文章
    async createArticle(req: Request, res: Response, next: NextFunction) {
        try {
            const { title, description, body, tagList } = req.body.article;
            const userId = (req as any).user._id;

            const article = new Article({
                title,
                description,
                body,
                tagList,
                author: userId,
            });

            await article.save();

            res.status(200).json({
                code: 0,
                data: article,
            });
        } catch (error) {
            next(error);
        }
    }

    // 更新文章
    async updateArticle(req: Request, res: Response, next: NextFunction) {
        try {
            const article = (req as any).article;
            const bodyArticle = req.body.article;
            article.title = bodyArticle.title || article.title;
            // article.tagList = bodyArticle.tagList || article.tagList;
            article.description = bodyArticle.description || article.description;
            article.body = bodyArticle.body || article.body;

            article.save();

            res.status(200).json({
                code: 0,
                data: {
                    article,
                },
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new Articles();