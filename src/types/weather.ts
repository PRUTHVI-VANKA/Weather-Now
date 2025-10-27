export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export interface CurrentWeather {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  windDirection?: number;
  humidity: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
}

export interface HourlyForecast {
  time: string[];
  temperature: number[];
  precipitation: number[];
  weatherCode: number[];
  windSpeed: number[];
  humidity: number[];
}

export interface DailyForecast {
  time: string[];
  weatherCode: number[];
  tempMax: number[];
  tempMin: number[];
  precipitationSum: number[];
  precipitationProbability: number[];
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast;
  daily: DailyForecast;
  timezone: string;
  location?: {
    name: string;
    country: string;
  };
}

export type WeatherCondition = 'sunny' | 'rainy' | 'snowy' | 'cloudy';
