import { Injectable, NotFoundException } from '@nestjs/common';
import { EmailService } from './../email/email.service';
import { AiIntegrationService } from './ai-integration.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { GetWeatherDataDTO } from 'src/weather-info/dto/get-weather-data.dto';
import { ConfigurationService } from 'src/configuration/configuration.service';
import { UserService } from './../user/user.service';
import { WeatherDetails } from './schemas/weather.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class WeatherInfoService {
  constructor(
    private emailService: EmailService,
    private aiService: AiIntegrationService,
    private configurationService: ConfigurationService,
    private userService: UserService,
    @InjectModel('WeatherDetails')
    private weatherDetailsModel: Model<WeatherDetails>,
  ) {}

  @Cron(CronExpression.EVERY_3_HOURS)
  async handleWeatherEmails() {
    const users = await this.userService.getAllUsers();
    for (const user of users) {
      try {
        const weatherData = await this.weatherDetailsModel.find({
          username: user.username,
        });
        const aiText = await this.aiService.generateWeatherText(weatherData[0]);
        const emailContent = this.formatEmail(weatherData[0], aiText);
        await this.emailService.sendEmail(user.email, emailContent);
      } catch (error) {
        console.error(`Failed to process user ${user.email}:`, error);
      }
    }
  }

  private formatEmail(weatherData: any, aiText: string): string {
    return `
      <h1>Weather Report for ${weatherData.name}</h1>
      <p>${aiText}</p>
      <h2>Detailed Data:</h2>
      <ul>
        <li>Temperature: ${weatherData.main.temp}°C</li>
        <li>Feels like: ${weatherData.main.feels_like}°C</li>
        <li>Humidity: ${weatherData.main.humidity}%</li>
        <li>Wind Speed: ${weatherData.wind.speed} m/s</li>
        <li>Conditions: ${weatherData.weather[0].description}</li>
      </ul>
    `;
  }

  async getWeatherData(getWeatherDataDTO: GetWeatherDataDTO) {
    const { location, countryCode, state, username } = getWeatherDataDTO;
    const weatherInfo = await this.weatherDetailsModel.find({
      state: state,
      countryCode: countryCode,
      username: username,
    });

    const apiKey = this.configurationService.getApiKey();

    try {
      const { data } = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${location},${state},${countryCode}&limit=${10}&appid=${apiKey}`,
      );

      console.log(data);

      if (data.length === 0) {
        throw new NotFoundException("Couldn't found location", {
          cause: new Error(),
          description: "Couldn't found location",
        });
      }

      if (data.length > 0) {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${data[0].lat}&lon=${data[0].lon}&appid=${apiKey}`,
        );

        if (weatherInfo.length !== 0) {
          const existWeatherEntry = weatherInfo[0].weatherDetails.find(
            (detail) => {
              return detail.location === location ? detail : '';
            },
          );

          if (existWeatherEntry) {
            const updatedDetails = await this.weatherDetailsModel.updateOne(
              { username: username, 'weatherDetails.location': location },
              {
                $set: {
                  'weatherDetails.$.coord': response.data.coord,
                  'weatherDetails.$.weather': response.data.weather,
                  'weatherDetails.$.main': response.data.main,
                  'weatherDetails.$.wind': response.data.wind,
                  'weatherDetails.$.clouds': response.data.clouds,
                  'weatherDetails.$.last_modified': new Date(),
                  updated: true,
                },
              },
            );
            return updatedDetails;
          } else {
            const newWeatherEntry = {
              coord: response.data.coord,
              weather: response.data.weather,
              main: response.data.main,
              wind: response.data.wind,
              clouds: response.data.clouds,
              location: location,
              last_modified: new Date(),
            };
            const updatedDetails = await this.weatherDetailsModel.updateOne(
              { username: username, state: state },
              {
                last_modified: new Date(),
                $push: { weatherDetails: newWeatherEntry },
              },
            );
            return updatedDetails;
          }
        } else {
          const details = await this.weatherDetailsModel.create({
            countryCode: countryCode,
            state: state ?? data[0].state,
            last_modified: new Date(),
            username: username,
            weatherDetails: [
              {
                coord: response.data.coord,
                weather: response.data.weather,
                main: response.data.main,
                wind: response.data.wind,
                clouds: response.data.clouds,
                last_modified: new Date(),
                location: location,
              },
            ],
          });
          const savedDetails = await details.save();
          return savedDetails;
        }
      }
    } catch (error) {
      throw new NotFoundException("Public endpoint data couldn't find.", {
        cause: new Error(),
        description: error.message,
      });
    }

    throw new NotFoundException("Couldn't found location", {
      cause: new Error(),
      description: "Couldn't found location",
    });
  }
}
