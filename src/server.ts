import App from "./app";
import "dotenv/config";

import { validateEnv } from "./utils/validateEnv";

import { PostsController } from "./bus/posts";
import AuthController from "./bus/auth/auth.controller";

validateEnv();

const app = new App([new PostsController(), new AuthController()]);

app.listen();
