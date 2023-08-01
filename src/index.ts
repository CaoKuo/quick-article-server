import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import router from './router';

import { User } from './model';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.use(cors());

const PORT = process.env.PORT || 5000;

app.use('/api', router);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})
