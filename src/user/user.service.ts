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

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private authService: AuthService,
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

  async getAllUsers() {
    const users = await this.userModel.find();
    if (users.length > 0) {
      return users;
    } else {
      throw new NotFoundException('No Users exist.', {
        cause: new Error(),
        description: "Users don't exist",
      });
    }
  }

  async getUserByUsername(username: string) {
    const users = await this.userModel.find({ username: username });
    if (users.length > 0) {
      return users[0];
    } else {
      throw new NotFoundException('No Users exist.', {
        cause: new Error(),
        description: "Users don't exist",
      });
    }
  }
}
