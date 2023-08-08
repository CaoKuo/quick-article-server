import express from 'express';
import Profiles from '../controller/profiles';
import ProfilesValidator from '../validator/profiles';
import auth from '../middleware/auth';

const router = express.Router();

// 获取关注的用户列表
router.get('/list', auth, Profiles.getProfilesUserList);

// 获取用户信息
router.get('/:userId', auth, ProfilesValidator.getProfilesUser, Profiles.getProfilesUser);

// 关注用户
router.post('/:userId/follow', auth, ProfilesValidator.followUser, Profiles.followUser);

// 取消关注
router.delete('/:userId/follow', auth, ProfilesValidator.unFollowUser, Profiles.unFollowUser);

export default router;
