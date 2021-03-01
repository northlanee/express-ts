import HttpException from "./httpException";

class WrongAuthToken extends HttpException {
  constructor() {
    super(401, "Wrong authentication token");
  }
}

export default WrongAuthToken;
