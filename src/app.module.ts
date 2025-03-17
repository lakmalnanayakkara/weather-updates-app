import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { MongoConfigModule } from './mongo-config/mongo-config.module';
import { EmailModule } from './email/email.module';
import { WeatherInfoModule } from './weather-info/weather-info.module';

@Module({
  imports: [AuthModule, UserModule, ConfigurationModule, MongoConfigModule, EmailModule, WeatherInfoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
