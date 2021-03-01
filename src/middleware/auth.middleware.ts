import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { UserModel } from "../bus/users";
import { AuthTokenMissing, WrongAuthToken } from "../exceptions";
import { DataStoredInToken, RequestWithUser } from "../interfaces";

const authMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const cookies = req.cookies;
  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET;
    try {
      const verificationResponse = jwt.verify(
        cookies.Authorization,
        secret
      ) as DataStoredInToken;
      const id = verificationResponse._id;
      const user = await UserModel.findById(id);
      if (user) {
        req.user = user;
        next();
      } else {
        next(new WrongAuthToken());
      }
    } catch (err) {
      next(new WrongAuthToken());
    }
  } else {
    next(new AuthTokenMissing());
  }
};

export default authMiddleware;
