import { GeocodingResult, WeatherData, WeatherCondition } from '../types/weather';

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

export async function searchCities(query: string): Promise<GeocodingResult[]> {
  if (!query || query.length < 2) return [];

  try {
    const response = await fetch(`${GEOCODING_API}?name=${encodeURIComponent(query)}&count=5`);
    if (!response.ok) throw new Error('Geocoding failed');

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
}

export async function getWeatherData(
  latitude: number,
  longitude: number,
  locationName?: string,
  country?: string
): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: 'temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,relative_humidity_2m,precipitation,rain,showers,snowfall',
    hourly: 'temperature_2m,precipitation_probability,weather_code,wind_speed_10m,relative_humidity_2m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max',
    timezone: 'auto',
  });

  try {
    const response = await fetch(`${WEATHER_API}?${params}`);
    if (!response.ok) throw new Error('Weather fetch failed');

    const data = await response.json();

    return {
      current: {
        temperature: data.current.temperature_2m,
        weatherCode: data.current.weather_code,
        windSpeed: data.current.wind_speed_10m,
        windDirection: data.current.wind_direction_10m,
        humidity: data.current.relative_humidity_2m,
        precipitation: data.current.precipitation,
        rain: data.current.rain,
        showers: data.current.showers,
        snowfall: data.current.snowfall,
      },
      hourly: {
        time: data.hourly.time.slice(0, 24),
        temperature: data.hourly.temperature_2m.slice(0, 24),
        precipitation: data.hourly.precipitation_probability.slice(0, 24),
        weatherCode: data.hourly.weather_code.slice(0, 24),
        windSpeed: data.hourly.wind_speed_10m.slice(0, 24),
        humidity: data.hourly.relative_humidity_2m.slice(0, 24),
      },
      daily: {
        time: data.daily.time,
        weatherCode: data.daily.weather_code,
        tempMax: data.daily.temperature_2m_max,
        tempMin: data.daily.temperature_2m_min,
        precipitationSum: data.daily.precipitation_sum,
        precipitationProbability: data.daily.precipitation_probability_max,
      },
      timezone: data.timezone,
      location: locationName ? { name: locationName, country: country || '' } : undefined,
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
}

export function getWeatherCondition(weatherCode: number): WeatherCondition {
  if (weatherCode === 0 || weatherCode === 1) return 'sunny';
  if (weatherCode >= 71 && weatherCode <= 77) return 'snowy';
  if (weatherCode >= 85 && weatherCode <= 86) return 'snowy';
  if (weatherCode >= 51 && weatherCode <= 67) return 'rainy';
  if (weatherCode >= 80 && weatherCode <= 82) return 'rainy';
  if (weatherCode === 95 || weatherCode === 96 || weatherCode === 99) return 'rainy';
  return 'cloudy';
}

export function getWeatherDescription(weatherCode: number): string {
  const descriptions: { [key: number]: string } = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };

  return descriptions[weatherCode] || 'Unknown';
}

export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}
