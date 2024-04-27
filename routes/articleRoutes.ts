import { Router } from "express";

import {
  commentArticle,
  createArticle,
  deleteArticle,
  getArticle,
  getArticleByFilter,
  getArticles,
  likeArticle,
  likeComment,
  likeReply,
  removeComment,
  replyComment,
  updateArticle,
  updateComment,
  updateReplie,
} from "../controllers/articleController";
import { ERole } from "../models/userModel";
import { isAuthorized, isAuthorizedRole } from "../utilite/isAthorazed";
const articleRouter = Router();

articleRouter.post(
  "/article",
  isAuthorized ,
  isAuthorizedRole(ERole.SPECIALIST),
  createArticle
);
articleRouter.delete(
  "/article/:id",
  isAuthorizedRole(ERole.SPECIALIST),
  deleteArticle
);
articleRouter.put(
  "/article/:id",
  isAuthorized,
  isAuthorizedRole(ERole.SPECIALIST),
  updateArticle
);
articleRouter.get("/articles", getArticles);
articleRouter.get("/article/:id", getArticle);
articleRouter.get("/articleByWriter",isAuthorized, getArticleByFilter);
articleRouter.put("/like_article/:id",isAuthorized, likeArticle);
articleRouter.put("/comment_article/:id",isAuthorized, commentArticle);
articleRouter.put("/like_comment/:id",isAuthorized,likeComment);
articleRouter.put("/reply_comment/:id", replyComment);
articleRouter.put("/like_reply/:id", likeReply);
articleRouter.delete(
  "/comment_article/:id",
  isAuthorizedRole(ERole.SPECIALIST),
  removeComment
);
articleRouter.put("/update_comment_article/:id", updateComment);
articleRouter.put("/update_reply_article/:id", updateReplie);

export default articleRouter;
