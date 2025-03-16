import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface DatabaseConfig {
  uri: string;
}

export interface JwtConfig {
  secretKey: string;
  validity: number;
}

@Injectable()
export class ConfigurationService {
  private dbConfig: DatabaseConfig;
  private jwtConfig: JwtConfig;
  private apiKey: string;

  constructor(private configService: ConfigService) {
    this.dbConfig = {
      uri: configService.get<string>('MONGODB_URI')!,
    };

    this.jwtConfig = {
      secretKey: configService.get<string>('SECRET_KEY')!,
      validity: configService.get<number>('TOKEN_VALIDITY')!,
    };

    this.apiKey = configService.get<string>('API_KEY')!;
  }

  public getDbConfig() {
    return this.dbConfig;
  }

  public getJwtConfig() {
    return this.jwtConfig;
  }

  public getApiKey() {
    return this.apiKey;
  }
}
