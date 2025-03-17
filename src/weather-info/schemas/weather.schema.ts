import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { WeatherInfo } from './../../interface/weather.interface';
@Schema()
class WeatherInformation {
  @Prop({ type: Object })
  coord: {
    lon: number;
    lat: number;
  };

  @Prop({
    type: [
      {
        id: Number,
        main: String,
        description: String,
        icon: String,
      },
    ],
  })
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];

  @Prop({
    type: Object,
  })
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };

  @Prop({
    type: Object,
  })
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };

  @Prop({
    type: Object,
  })
  clouds: {
    all: number;
  };

  @Prop({ type: Date, default: Date.now })
  last_modified: Date;

  @Prop()
  location: string;
}

export const WeatherInfoSchema =
  SchemaFactory.createForClass(WeatherInformation);

@Schema()
export class WeatherDetails extends Document {
  @Prop()
  location: string;

  @Prop()
  state: string;

  @Prop()
  countryCode: string;

  @Prop()
  last_modified: Date;

  @Prop()
  username: string;

  @Prop({ type: [WeatherInfoSchema], default: [] })
  weatherDetails: WeatherInfo[];
}

export const WeatherSchema = SchemaFactory.createForClass(WeatherDetails);
