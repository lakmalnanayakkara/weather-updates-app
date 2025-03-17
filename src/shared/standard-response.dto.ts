import { IsNumber, IsObject, IsString } from 'class-validator';

export class StandardResponse {
  @IsNumber()
  code: number;

  @IsString()
  message: string;

  @IsObject()
  data: object;
}
