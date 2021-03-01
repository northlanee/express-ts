import HttpException from "./httpException";

class WrongCredentials extends HttpException {
  constructor() {
    super(400, "Email or password is invalid");
  }
}

export default WrongCredentials;
