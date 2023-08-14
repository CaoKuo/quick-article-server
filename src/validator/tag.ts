import { body } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { isValidObjectId, validate } from '../middleware/validate';
import { Tag } from '../model';

const addTag = validate([
    body('tag').notEmpty().withMessage('标签名不能为空！')
        .custom(async (tag, { req }) => {
            const tags = await Tag.findOne({ tag });

            if(tags) {
                return Promise.reject(new Error('当前标签已存在'));
            }
        }),
]);

const updateTag = validate([
    isValidObjectId(['params'], 'tagId'),
]);

const deleteTag = [
    validate([
        isValidObjectId(['params'], 'tagId'),
    ]),
    async (req: Request, res: Response, next: NextFunction) => {
        const tagId = req.params.tagId;

        const tag = await Tag.findById(tagId);

        if(!tag) {
            return res.status(404).json({
                code: -1,
                msg: '未有该标签或已被删除',
            });
        }

        next();
    },
];

export default {
    addTag,
    updateTag,
    deleteTag,
};