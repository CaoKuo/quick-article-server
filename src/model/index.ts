import mongoose from 'mongoose';
import config from '../config/index';

import userSchema from './user';
import articleSchema from './article';
import userFollowSchema from './userFollow';

mongoose.connect(config.dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as mongoose.ConnectOptions)
    .then(() => {
        console.log('Connected to MongoDB database!');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB database:', err);
    });
// 组织导出模型类
const User = mongoose.model('User', userSchema);
const Article = mongoose.model('Article', articleSchema);
const UserFollow = mongoose.model('UserFollow', userFollowSchema);

export { User, Article, UserFollow };