import express from "express";
import mongoose from "mongoose";
import errorMiddleware from "./middleware/error.middleware";

import Controller from "./interfaces/controller.interface";

class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.connectToDB();
    this.initializeMiddleware();
    this.initializeControllers(controllers);
    this.initializeErrorHandler();
  }

  private initializeMiddleware() {
    this.app.use(express.json());
  }

  private initializeControllers(conrollers: Controller[]) {
    conrollers.forEach((controller: Controller) => {
      this.app.use("/", controller.router);
    });
  }

  private initializeErrorHandler() {
    this.app.use(errorMiddleware);
  }

  private connectToDB() {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
    mongoose.connect(
      `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }
}

export default App;
