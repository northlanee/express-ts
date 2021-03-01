import { IsString } from "class-validator";

class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
}

export default CreateUserDto;
