import mongoose from "mongoose";
import config from '../config/index'

import userSchema from "./user";
import articleSchema from "./article";

mongoose.connect(config.dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as mongoose.ConnectOptions).then(() => {
    console.log('Connected to MongoDB database!');
})
.catch((err) => {
    console.error('Error connecting to MongoDB database:', err);
});
// 组织导出模型类
const User = mongoose.model('User', userSchema);
const Article = mongoose.model('Article', articleSchema);

export { User, Article };