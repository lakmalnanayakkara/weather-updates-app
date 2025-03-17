import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from 'src/auth/decorators/auth.decorator';
import { StandardResponse } from 'src/shared/standard-response.dto';
import { UserSignInDTO } from './dto/user-signin.dto';
import { UserSignUpDTO } from './dto/user-signup.dto';

@Controller('api/v1/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/sign-up')
  @Public()
  async userSignUp(
    @Body() userSignUpDTO: UserSignUpDTO,
  ): Promise<StandardResponse> {
    const data = await this.userService.userSignUp(userSignUpDTO);
    const response: StandardResponse = {
      code: 200,
      message: 'SUCCESSFUL',
      data: data,
    };
    return response;
  }

  @Get('/sign-in')
  @Public()
  async userSignIn(
    @Body() userSignInDTO: UserSignInDTO,
  ): Promise<StandardResponse> {
    const data = await this.userService.userSignIn(userSignInDTO);
    const response: StandardResponse = {
      code: 200,
      message: 'SUCCESSFUL',
      data: data,
    };
    return response;
  }

  @Get('')
  getCheck() {
    return 'Works';
  }
}
