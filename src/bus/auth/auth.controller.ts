import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User, CreateUserDto, SignInDto, UserModel } from "../users";

import { validationMiddleware } from "../../middleware";
import {
  HttpException,
  UserAlreadyExists,
  WrongCredentials,
} from "../../exceptions";
import { DataStoredInToken, Controller } from "../../interfaces";

interface TokenData {
  token: string;
  expiresIn: number;
}

class AuthController implements Controller {
  public path = "/auth";
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/signup`,
      validationMiddleware(CreateUserDto),
      this.signUp
    );
    this.router.post(
      `${this.path}/signin`,
      validationMiddleware(SignInDto),
      this.signIn
    );
    this.router.get(`${this.path}/signout`, this.signOut);
  }

  private signUp = async (req: Request, res: Response, next: NextFunction) => {
    const userData: CreateUserDto = req.body;
    const user = await UserModel.findOne({ email: userData.email });
    if (user) {
      next(new UserAlreadyExists(userData.email));
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      userData.password = hashedPassword;
      const user = new UserModel(userData);
      const result = await user.save();
      if (!result) next(new HttpException());
      const token = this.createToken(user);
      res.setHeader("Set-Cookie", [this.createCookie(token)]);
      res.json(result);
    }
  };

  private signIn = async (req: Request, res: Response, next: NextFunction) => {
    const signInData: SignInDto = req.body;
    const user = await UserModel.findOne({ email: signInData.email });
    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        signInData.password,
        user.password
      );
      if (isPasswordMatching) {
        user.password = undefined;
        const token = this.createToken(user);
        res.setHeader("Set-Cookie", [this.createCookie(token)]);
        res.json(user);
      } else {
        next(new WrongCredentials());
      }
    } else {
      next(new WrongCredentials());
    }
  };

  private signOut = (req: Request, res: Response) => {
    res.setHeader("Set-Cookie", ["Authorization=;Max-age=0"]);
    res.status(200).json({ message: "Logged out" });
  };

  private createToken(user: User): TokenData {
    const expiresIn = 60 * 60;
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }

  private createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }
}

export default AuthController;
