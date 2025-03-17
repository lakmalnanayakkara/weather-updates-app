import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface DatabaseConfig {
  uri: string;
}

export interface JwtConfig {
  secretKey: string;
  validity: number;
}

export interface EmailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
}

@Injectable()
export class ConfigurationService {
  private dbConfig: DatabaseConfig;
  private jwtConfig: JwtConfig;
  private apiKey: string;
  private emailConfig: EmailConfig;
  private openAiKey: string;

  constructor(private configService: ConfigService) {
    this.dbConfig = {
      uri: configService.get<string>('MONGODB_URI')!,
    };

    this.jwtConfig = {
      secretKey: configService.get<string>('SECRET_KEY')!,
      validity: configService.get<number>('TOKEN_VALIDITY')!,
    };

    this.apiKey = configService.get<string>('API_KEY')!;

    this.emailConfig = {
      host: configService.get<string>('EMAIL_HOST')!,
      port: configService.get<number>('EMAIL_PORT')!,
      user: configService.get<string>('EMAIL_USER')!,
      password: configService.get<string>('EMAIL_PASSWORD')!,
    };

    this.openAiKey = configService.get<string>('OPEN_API_KEY')!;
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

  public getEmailConfig() {
    return this.emailConfig;
  }

  public getOpenAiKey() {
    return this.openAiKey;
  }
}
