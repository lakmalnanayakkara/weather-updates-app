import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigurationModule } from 'src/configuration/configuration.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    AuthModule,
    ConfigurationModule,
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
