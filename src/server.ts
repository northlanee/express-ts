import App from "./app";
import "dotenv/config";

import { validateEnv } from "./utils/validateEnv";

import PostsController from "./bus/posts/posts.controller";

validateEnv();

const app = new App([new PostsController()]);

app.listen();
