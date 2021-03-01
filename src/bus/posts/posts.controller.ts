import express, { Request, Response, NextFunction } from "express";
import Post from "./post.interface";
import PostModel from "./posts.model";
import HttpException from "../../exceptions/httpException";
import validationMiddleware from "../../middleware/validation.middleware";
import PostDto from "./post.dto";

class PostsController {
  public path = "/posts";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.post(this.path, validationMiddleware(PostDto), this.createPost);
    this.router.get(`${this.path}/:id`, this.getPost);
    this.router.patch(
      `${this.path}/:id`,
      validationMiddleware(PostDto, true),
      this.modifyPost
    );
    this.router.delete(`${this.path}/:id`, this.deletePost);
  }

  private async getAllPosts(req: Request, res: Response) {
    const posts = await PostModel.find();
    res.json(posts);
  }

  private async createPost(req: Request, res: Response) {
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

  private async modifyPost(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const postData = req.body;
    const post = await PostModel.findOneAndUpdate({ _id: id }, postData, {
      new: true,
    });
    if (!post) return next(new HttpException(404, "Post not found"));
    res.json(post);
  }

  private async deletePost(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const post = await PostModel.findOneAndDelete({ _id: id });
    if (!post) return next(new HttpException(404, "Post not found"));
    res.json(post);
  }
}

export default PostsController;
