import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { MongoConfigModule } from './mongo-config/mongo-config.module';

@Module({
  imports: [AuthModule, UserModule, ConfigurationModule, MongoConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
