import { Request } from "express";
import { User } from "../bus/users";

interface RequestWithUser extends Request {
  user: User;
}

export default RequestWithUser;
