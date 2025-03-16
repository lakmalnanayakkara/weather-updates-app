import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserSignUpDTO } from './dto/user-signup.dto';
import { UserSignInDTO } from './dto/user-signin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { AuthService } from './../auth/auth.service';
import { GetWeatherDataDTO } from './dto/get-weather-data.dto';
import { ConfigurationService } from 'src/configuration/configuration.service';
import axios from 'axios';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private authService: AuthService,
    private configurationService: ConfigurationService,
  ) {}

  async userSignIn(userSignInDTO: UserSignInDTO) {
    const { username, password } = userSignInDTO;
    const existingUser = await this.userModel.find({
      username: username,
    });
    if (existingUser.length == 0) {
      throw new UnauthorizedException('Invalid Username', {
        cause: new Error(),
        description: 'Invalid Username',
      });
    } else {
      const passwordMatched = await this.authService.comparePassword(
        password,
        existingUser[0].password,
      );
      if (!passwordMatched) {
        throw new UnauthorizedException('Invalid Password', {
          cause: new Error(),
          description: 'Invalid Password',
        });
      } else {
        const access_token = this.authService.generateToken(existingUser[0]);
        return { username: existingUser[0].username, access_token };
      }
    }
  }

  async userSignUp(userSignUpDTO: UserSignUpDTO) {
    const { name, email, username, password, isActive } = userSignUpDTO;
    const existingUser = await this.userModel.find({
      username: username,
    });

    if (existingUser.length !== 0) {
      throw new ConflictException('Username already exists', {
        cause: new Error(),
        description: 'Username already exists',
      });
    } else {
      const hashPassword = await this.authService.hashPassword(password);
      const newUser = await this.userModel.create({
        name,
        username,
        password: hashPassword,
        email,
        isActive,
      });

      const savedUser = await newUser.save();
      const access_token = this.authService.generateToken(savedUser);
      return { username: savedUser.username, access_token };
    }
  }

  async getWeatherData(getWeatherDataDTO: GetWeatherDataDTO) {
    const { location, countryCode, state } = getWeatherDataDTO;
    const apiKey = this.configurationService.getApiKey();
    const { data } = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${location},${countryCode}&limit=${10}&appid=${apiKey}`,
    );

    if (data.length === 0) {
      throw new NotFoundException("Couldn't found location", {
        cause: new Error(),
        description: "Couldn't found location",
      });
    }

    if (data.length === 1) {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${data[0].lat}&lon=${data[0].lon}&appid=${apiKey}`,
      );
      return response.data;
    }

    if (data.length > 1) {
      const exactLocation = data.find((loc) => {
        if (loc.state === state) {
          return loc;
        }
      });

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${exactLocation.lat}&lon=${exactLocation.lon}&appid=${apiKey}`,
      );

      return response.data;
    }
  }
}
