import { NextFunction, Request, Response } from 'express';
import { Tag } from '../model';

class Tags {
    // 添加标签
    async addTag(req: Request, res: Response, next: NextFunction) {
        try {
            const user = (req as any).user;

            if(user.role != 2) {
                return res.status(400).json({
                    code: -1,
                    msg: '用户权限不足',
                });
            }

            const bodyTag = {
                name: req.body.tag,
            };

            const tag = new Tag(bodyTag);

            await tag.save();

            res.status(200).json({
                code: 0,
                msg: '保存成功',
            });

        } catch (error) {
            next(error);
        }
    }

    async updateTag(req: Request, res: Response, next: NextFunction) {
        try {
            const tagId = req.params.tagId;

            const user = (req as any).user;

            if(user.role != 2) {
                return res.status(400).json({
                    code: -1,
                    msg: '用户权限不足',
                });
            }

            const tag = {
                name: req.body.tag,
            };

            const updateTag = await Tag.findByIdAndUpdate(
                {_id: tagId},
                tag,
                { new: true },
            );

            if(!updateTag) {
                return res.status(400).json({
                    code: -1,
                    msg: '标签未找到!',
                });
            }

            res.status(200).json({
                code: 0,
                msg: '更新成功!',
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteTag(req: Request, res: Response, next: NextFunction) {
        try {
            const tagId = req.params.tagId;

            await Tag.findByIdAndDelete(tagId);

            res.status(200).json({
                code: 0,
                msg: '删除成功',
            });
        } catch (error) {
            next(error);
        }
    }

    // 获取标签列表
    async getTagsList(req: Request, res: Response, next: NextFunction){
        try {
            const {
                pageNum = 1,
                pageSize = 10,
                tag,
            } = req.query;

            const skipCount = (Number(pageNum) - 1)  * Number(pageSize);

            const filter: { [key: string]: any } = {};

            if(tag) {
                filter.name = tag;
            }

            const tags = await Tag.find(filter)
                .skip(skipCount)
                .limit(Number(pageSize))
                .sort({
                    createAt: -1,
                });
            
            const tagsCount = await Tag.countDocuments(filter);

            res.status(200).json({
                code: 0,
                data: {
                    tags,
                    total: tagsCount,
                },
            });

        } catch (error) {
            next(error);
        }
    }

    // 获取所有标签
    async getAllTagsList(req: Request, res: Response, next: NextFunction) {
        try {
            const tags = await Tag.find().sort({
                createAt: -1,
            });

            const tagsCount = await Tag.countDocuments();

            res.status(200).json({
                code: 0,
                data: {
                    tags,
                    total: tagsCount,
                },
            });

        } catch (error) {
            next(error);
        }
    }
}

export default new Tags();