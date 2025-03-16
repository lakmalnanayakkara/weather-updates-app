import { IsNotEmpty, IsString } from 'class-validator';

export class GetWeatherDataDTO {
  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  countryCode: string;

  @IsString()
  state: string;

  @IsString()
  @IsNotEmpty()
  date: string;
}
