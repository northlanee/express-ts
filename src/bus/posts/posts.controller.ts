import { Request, Response, NextFunction, Router } from "express";

import Post from "./post.interface";
import PostModel from "./posts.model";
import PostDto from "./post.dto";

import { HttpException } from "../../exceptions";
import { validationMiddleware, authMiddleware } from "../../middleware";
import { RequestWithUser } from "../../interfaces";
import { Controller } from "../../interfaces";
class PostsController implements Controller {
  public path = "/posts";
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPost);

    this.router.post(
      this.path,
      authMiddleware,
      validationMiddleware(PostDto),
      this.createPost
    );
    this.router.patch(
      `${this.path}/:id`,
      authMiddleware,
      validationMiddleware(PostDto, true),
      this.modifyPost
    );
    this.router.delete(`${this.path}/:id`, authMiddleware, this.deletePost);
  }

  private async getAllPosts(req: Request, res: Response) {
    const posts = await PostModel.find();
    res.json(posts);
  }

  private async createPost(req: RequestWithUser, res: Response) {
    const postData: Post = req.body;
    const post = new PostModel(postData);
    await post.save();
    res.json(post);
  }

  private async getPost(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const post = await PostModel.findById(id);
    if (!post) return next(new HttpException(404, "Post not found"));
    res.json(post);
  }

  private async modifyPost(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    const id = req.params.id;
    const postData = req.body;
    const post = await PostModel.findOneAndUpdate({ _id: id }, postData, {
      new: true,
    });
    if (!post) return next(new HttpException(404, "Post not found"));
    res.json(post);
  }

  private async deletePost(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    const id = req.params.id;
    const post = await PostModel.findOneAndDelete({ _id: id });
    if (!post) return next(new HttpException(404, "Post not found"));
    res.json(post);
  }
}

export default PostsController;
