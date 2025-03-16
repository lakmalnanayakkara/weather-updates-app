import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import { ConfigurationService } from 'src/configuration/configuration.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigurationModule],
      inject: [ConfigurationService],
      useFactory: (configurationService: ConfigurationService) => ({
        uri: configurationService.getDbConfig().uri,
        onConnectionCreate: (connection: Connection) => {
          connection.on('connected', () => {
            console.log('connected to mongodb');
          });
        },
      }),
    }),
  ],
})
export class MongoConfigModule {}
