import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { GetWeatherDataDTO } from './dto/get-weather-data.dto';
import { WeatherInfoService } from './weather-info.service';
import { StandardResponse } from 'src/shared/standard-response.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('api/v1/weather-info')
export class WeatherInfoController {
  constructor(private weatherInfoService: WeatherInfoService) {}

  @Get('/get-details')
  @UseGuards(AuthGuard)
  async getWeatherDetails(
    @Body() getWeatherDataDTO: GetWeatherDataDTO,
  ): Promise<StandardResponse> {
    const data =
      await this.weatherInfoService.getWeatherData(getWeatherDataDTO);
    const response: StandardResponse = {
      code: 200,
      message: 'SUCCESSFUL',
      data: data,
    };
    return response;
  }
}
