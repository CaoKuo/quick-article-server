import express from 'express';
import Tags from '../controller/tag';
import tagValidator from '../validator/tag';
import auth from '../middleware/auth';

const router = express.Router();

// 获取标签列表
router.get('/', Tags.getTagsList);

// 获取所有标签
router.get('/all', Tags.getAllTagsList);

// 新增标签
router.post('/', auth, tagValidator.addTag, Tags.addTag);

// 编辑标签
router.put('/:tagId', auth, tagValidator.updateTag, Tags.updateTag);

// 删除标签
router.delete('/:tagId', auth, tagValidator.deleteTag, Tags.deleteTag);

export default router;
