import { cleanEnv, str, port } from "envalid";

export const validateEnv = () => {
  cleanEnv(process.env, {
    MONGO_PASSWORD: str(),
    MONGO_PATH: str(),
    MONGO_USER: str(),
    PORT: port(),
  });
};
