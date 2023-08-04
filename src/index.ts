import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './router';
import errorHandler from './middleware/error-handler';

import { User } from './model';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(morgan('dev'));

app.use(cors());

const PORT = process.env.PORT || 5000;

app.use('/api', router);

// 挂载统一处理服务端异常中间件
app.use(errorHandler())

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})
