import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigurationService } from 'src/configuration/configuration.service';

@Injectable()
export class AiIntegrationService {
  private openai;

  constructor(private configurationService: ConfigurationService) {
    this.openai = new OpenAI({
      apiKey: this.configurationService.getOpenAiKey(),
    });
  }

  async generateWeatherText(weatherData: any): Promise<string> {
    const prompt = `Generate a friendly weather report summary using this data: 
      Temperature: ${weatherData.main.temp}°C, 
      Condition: ${weatherData.weather[0].description}, 
      Humidity: ${weatherData.main.humidity}%, 
      Wind Speed: ${weatherData.wind.speed} m/s`;

    const completion = await this.openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
    });

    return completion.choices[0].message.content;
  }
}
