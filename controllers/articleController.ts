import { Response, Request } from "express";
import { IArticle, IReplie } from "../models/articleModel";
import ErrorHandler from "../ErrorHandler";
import Article from "../models/articleModel";
import cloudinary from "cloudinary";
import mongoose, { ObjectId } from "mongoose";
import { makeNotifiaction } from "./notificationController";
require("dotenv").config();

export const createArticle = async (req: Request, res: Response) => {
  try {
    const { title, content, image } = req.body;
    console.log(121)
    if (!image) throw new Error("You must provide an image");
    const myCloud = await cloudinary.v2.uploader.upload(image, {
      folder: "articleImages",
      width: 150,
    });
   
    const article = await Article.create({
      title,
      content,
      creatorId: (req as any).user._id,
      image: {
        public_id: myCloud.public_id,
        url: myCloud.url,
      },
    });
    if (!article) {
      throw new Error("Article not created");
    }
    console.log('sended')
    res.status(200).json({ success: true });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const article = await Article.findById(req.params.id);
    if (article?.creatorId != (req as any).user._id) {
      throw new Error("You cant delete this article , it's not yours");
    }
    await Article.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const updateArticle = async (req: Request, res: Response) => {
  try {
    const { title, content, image } = req.body;
    const article = (await Article.findById(req.params.id)) as IArticle;
    if (article?.creatorId != (req as any).user._id) {
      throw new Error("You cant delete this article , it's not yours");
    }
    if (title) article.title = title;
    if (content) article.content = content;
    if (image) {
      if (article.image.public_id)
        await cloudinary.v2.uploader.destroy(article.image.public_id);
      const myCloud = await cloudinary.v2.uploader.upload(image.toString(), {
        folder: "avatars",
        width: 150,
      });
      article.image.public_id = myCloud.public_id;
      article.image.url = myCloud.url;
    }
    await article.save();
    res.status(200).json({success:true, article });
  } catch (err) {
    console.log('err')
    ErrorHandler(err, 400, res);
  }
};

export const getArticles = async (req: Request, res: Response) => {
  try {
    const articles = await Article.find().populate([
      {
        path: "creatorId",
        select: "firstName lastName avatar",
      },
      {
        path: "comments.userId",
        select: "firstName lastName avatar",
      },
      {
        path: "comments.replies.userId",
        select: "firstName lastName avatar",
      },
    ]);
    res.status(200).json({ articles });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const getArticle = async (req: Request, res: Response) => {
  try {
    const article = await Article.findById(req.params.id).populate([
      {
        path: "creatorId",
        select: "firstName lastName avatar",
      },
      {
        path: "comments.userId",
        select: "firstName lastName avatar",
      },
      {
        path: "comments.replies.userId",
        select: "firstName lastName avatar",
      },
    ]);
    res.status(200).json({ article });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const getArticleByFilter = async (req: Request, res: Response) => {
  try {
    const filter = req.body;
    const user = (req as any).user;
    const articles = await Article.find({creatorId:user._id});
    res.status(200).json({ articles });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const likeArticle = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const article = (await Article.findById(req.params.id)) as IArticle;
    const index = article.likes.findIndex((l) => l == user._id);
    if (index === -1) {
      article.likes.push(user._id);
      if (user._id != article.creatorId) {
        const content = `${user.firstName} ${user.lastName} like your article: ${article.title}`;
        await makeNotifiaction(article.creatorId, content);
      }
    } else {
      article.likes.splice(index, 1);
    }
    await article.save();
    res.status(200).json({ success: true });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const commentArticle = async (req: Request, res: Response) => {
  try {
    const { comment } = req.body;
    const user = (req as any).user;
    const article = (await Article.findById(req.params.id)) as IArticle;
    article.comments.push({ userId: user._id, comment } as any);
    if (user._id != article.creatorId) {
      const content = `${user.firstName} ${user.lastName} comment on your article : ${article.title}`;
      await makeNotifiaction(article.creatorId, content);
    }
    await article.save();
    res.status(200).json({ success: true });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const likeComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.body;
    const user = (req as any).user;
    if (!mongoose.isValidObjectId(commentId)) {
      throw new Error("Invalid comment ID");
    }
    const article = (await Article.findById(req.params.id)) as IArticle;
    const comment = article.comments.find((c) => ((c as any)._id = commentId));
    const index = comment?.likesId.findIndex((id) => id == user._id) as number;
    if (index === -1) {
      comment?.likesId.push(user._id);
      if (user._id != comment?.userId) {
        const content = `${user.firstName} ${user.lastName} like your comment: ${comment?.comment}`;
        await makeNotifiaction(comment?.userId as ObjectId, content);
      }
    } else {
      comment?.likesId.splice(index, 1);
    }
    await article.save();
    res.status(200).json({ success: true });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const replyComment = async (req: Request, res: Response) => {
  try {
    const { commentId, reply } = req.body;
    const user = (req as any).user;
    if (!mongoose.isValidObjectId(commentId)) {
      throw new Error("Invalid comment ID");
    }
    const article = (await Article.findById(req.params.id)) as IArticle;
    if (!article) {
      throw new Error("Article does not exist");
    }
    const comment = article.comments.find((c) => ((c as any)._id = commentId));
    if (!comment) {
      throw new Error("Comment does not exist");
    }
    comment.replies.push({ userId: user._id, comment: reply } as IReplie);
    await article.save();
    if (user._id != comment?.userId) {
      const content = `${user.firstName} ${user.lastName} reply to your comment: ${reply}`;
      await makeNotifiaction(comment?.userId as ObjectId, content);
    }
    res.status(200).json({ success: true });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const likeReply = async (req: Request, res: Response) => {
  try {
    const { commentId, replyId } = req.body;
    const user = (req as any).user;
    if (!mongoose.isValidObjectId(commentId)) {
      throw new Error("Invalid comment ID");
    }
    const article = (await Article.findById(req.params.id)) as IArticle;
    const comment = article.comments.find((c) => ((c as any)._id = commentId));
    const reply = comment?.replies.find((rep) => (rep as any)._id == replyId);
    if (!reply) {
      throw new Error("Reply does not exist");
    }
    const index = reply?.likesId.findIndex((id) => id == user._id) as number;
    if (index === -1) {
      reply?.likesId.push(user._id);
      if (user._id != reply.userId) {
        const content = `${user.firstName} ${user.lastName} like your reply: ${reply.comment}`;
        await makeNotifiaction(reply.userId, content);
      }
    } else {
      reply?.likesId.splice(index, 1);
    }
    await article.save();
    res.status(200).json({ success: true });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const removeComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.body;
    const user = (req as any).user;
    if (!mongoose.isValidObjectId(commentId)) {
      throw new Error("Invalid comment ID");
    }
    const article = (await Article.findById(req.params.id)) as IArticle;
    if (article.creatorId != (req as any).user._id) {
      throw new Error(
        "You cant delete this comment , this article is not yours"
      );
    }
    const index = article.comments.findIndex(
      (c) => ((c as any)._id = commentId)
    );
    if (index == -1) {
      article.comments.push(user._id);
    } else {
      article.comments.splice(index, 1);
    }
    await article.save();
    res.status(200).json({ success: true });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const { commentId, newComment } = req.body;
    const user = (req as any).user;
    if (!mongoose.isValidObjectId(commentId)) {
      throw new Error("Invalid comment ID");
    }
    const article = (await Article.findById(req.params.id)) as IArticle;
    if (!article) {
      throw new Error("Article does not exist");
    }
    const comment = article.comments.find((c) => ((c as any)._id = commentId));
    if (!comment) {
      throw new Error("Comment does not exist");
    }
    if (comment.userId != user._id)
      throw new Error("you cant update this comment is not yours");
    comment.comment = newComment;
    await article.save();
    if (user._id != comment?.userId) {
      const content = `${user.firstName} ${user.lastName} update his comment in your Article to ${comment.comment}`;
      await makeNotifiaction(article.creatorId, content);
    }
    res.status(200).json({ success: true });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const updateReplie = async (req: Request, res: Response) => {
  try {
    const { commentId, replyId, newReply } = req.body;
    const user = (req as any).user;
    if (!mongoose.isValidObjectId(commentId)) {
      throw new Error("Invalid comment ID");
    }
    const article = (await Article.findById(req.params.id)) as IArticle;
    if (!article) {
      throw new Error("Article does not exist");
    }
    const comment = article.comments.find((c) => ((c as any)._id = commentId));
    if (!comment) {
      throw new Error("Comment does not exist");
    }
    const reply = comment?.replies.find((rep) => (rep as any)._id == replyId);
    if (!reply) {
      throw new Error("Reply does not exist");
    }
    if (reply.userId != user._id)
      throw new Error("you cant update this comment is not yours");
    reply.comment = newReply;
    await article.save();
    if (user._id != comment?.userId) {
      const content = `${user.firstName} ${user.lastName} update his reply in your comment to ${newReply}`;
      await makeNotifiaction(comment.userId, content);
    }
    res.status(200).json({ success: true });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};
