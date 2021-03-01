import HttpException from "./httpException";

class UserAlreadyExists extends HttpException {
  constructor(email: string) {
    super(400, `User with email ${email} already exists`);
  }
}

export default UserAlreadyExists;
