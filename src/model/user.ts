import mongoose from "mongoose";
import baseModel from './base-model';

const userSchema = new mongoose.Schema({
    ...baseModel,
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        default: null,
    },
    image: {
        type: String,
        default: null,
    },
})

export default userSchema;