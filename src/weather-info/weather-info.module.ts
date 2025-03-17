import { Module } from '@nestjs/common';
import { WeatherInfoService } from './weather-info.service';
import { EmailModule } from 'src/email/email.module';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import { AiIntegrationService } from './ai-integration.service';
import { UserModule } from 'src/user/user.module';
import { WeatherSchema } from './schemas/weather.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { WeatherInfoController } from './weather-info.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    EmailModule,
    ConfigurationModule,
    UserModule,
    AuthModule,
    MongooseModule.forFeature([
      { name: 'WeatherDetails', schema: WeatherSchema },
    ]),
  ],
  providers: [WeatherInfoService, AiIntegrationService],
  exports: [WeatherInfoService, AiIntegrationService],
  controllers: [WeatherInfoController],
})
export class WeatherInfoModule {}
