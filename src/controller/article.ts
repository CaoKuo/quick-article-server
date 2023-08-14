import { Request, Response, NextFunction } from 'express';
import { Article, User, UserFollow } from '../model';

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
                const userFilter = {
                    username: {
                        $regex: new RegExp((author as string), 'i'),
                    },
                };
                const user: any[] = await User.find(userFilter);

                const userIds = user.map(user => user.id);

                filter.author = userIds;
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

    // 获取作者文章列表
    async getFeedArticles(req: Request, res: Response, next: NextFunction) {
        try {
            /**
             * 想法：
             * 1. userId在body里
             * 2. 不需要在乎关注还是未关注
             * 3. 通过suerId查询列表 获取
             */
            const userId = req.body.userId;

            const { 
                pageNum = 1,
                pageSize = 10,
                tagList,
            } = req.query;

            const skipCount = (Number(pageNum) - 1) * Number(pageSize);

            const filter: { [key: string]: any } = {};

            if(tagList) {
                filter.tagList = tagList;
            }

            filter.author = userId;

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

    // 删除文章
    async deleteArticle(req: Request, res: Response, next: NextFunction) {
        try {
            const articleId = (req as any).article._id;

            await Article.findByIdAndDelete(articleId);

            res.status(200).json({
                code: 0,
                msg: '删除成功',
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new Articles();