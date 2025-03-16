import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { UserSignInDTO } from './user-signin.dto';

export class UserSignUpDTO extends UserSignInDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean = true;
}
