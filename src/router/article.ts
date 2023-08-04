import express from "express";
import Articles from "../controller/article";
import articleValidator from "../validator/article";
import auth from "../middleware/auth";

const router = express.Router();

router.post('/', auth, articleValidator.createArticle, Articles.createArticle);

export default router;