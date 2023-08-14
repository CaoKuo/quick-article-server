import mongoose from 'mongoose';
import baseModel from './base-model';

const tagSchame = new mongoose.Schema({
    ...baseModel,
    name: {
        type: String,
        required: true,
    },
});

export default tagSchame;