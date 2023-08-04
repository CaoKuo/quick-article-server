import { Request, Response, NextFunction } from "express";
import { Article } from "../model";

class Articles {
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
                author: userId
            })

            await article.save();

            res.status(200).json({
                code: 0,
                data: article,
            })
        } catch (error) {
            
        }
    }
}

export default new Articles();