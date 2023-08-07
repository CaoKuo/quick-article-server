import mongoose, { Schema } from 'mongoose';

const userFollowSchema = new mongoose.Schema({
    follower: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    following: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    followedAt: {
        type: Date,
        default: Date.now,
    },
});

export default userFollowSchema;