import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from 'src/auth/decorators/auth.decorator';
import { StandardResponse } from 'src/shared/standard-response.dto';
import { UserSignInDTO } from './dto/user-signin.dto';
import { UserSignUpDTO } from './dto/user-signup.dto';
import { GetWeatherDataDTO } from './dto/get-weather-data.dto';
import { AuthGuard } from './../auth/guards/auth.guard';

@Controller('api/v1/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/sign-up')
  @Public()
  async userSigUp(
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

  @Get('/get-weather-condition')
  @UseGuards(AuthGuard)
  async getWeatherData(
    @Body() getWeatherDataDTO: GetWeatherDataDTO,
  ): Promise<StandardResponse> {
    const data = await this.userService.getWeatherData(getWeatherDataDTO);
    const response: StandardResponse = {
      code: 200,
      message: 'SUCCESSFUL',
      data: { data },
    };
    return response;
  }
}
