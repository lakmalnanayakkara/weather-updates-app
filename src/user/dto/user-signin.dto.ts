import { IsNotEmpty, IsString } from 'class-validator';

export class UserSignInDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
