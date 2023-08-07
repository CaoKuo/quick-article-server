import { validate, isValidObjectId } from '../middleware/validate';

const getProfilesUser = validate([
    isValidObjectId(['params'], 'userId'),
]);

const followUser = validate([
    isValidObjectId(['params'], 'userId'),
]);

const unFollowUser = validate([
    isValidObjectId(['params'], 'userId'),
]);

export default {
    getProfilesUser,
    followUser,
    unFollowUser,
};