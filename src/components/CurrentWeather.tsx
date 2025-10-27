import { Cloud, CloudRain, CloudSnow, Sun } from 'lucide-react';
import { CurrentWeather as CurrentWeatherType } from '../types/weather';
import { getWeatherDescription } from '../services/weatherService';

interface CurrentWeatherProps {
  weather: CurrentWeatherType;
  location?: { name: string; country: string };
}

export default function CurrentWeather({ weather, location }: CurrentWeatherProps) {
  const getWeatherIcon = (code: number) => {
    if (code === 0 || code === 1) return <Sun className="w-24 h-24 text-yellow-300" />;
    if (code >= 71 && code <= 77 || code >= 85 && code <= 86) return <CloudSnow className="w-24 h-24 text-blue-200" />;
    if (code >= 51 && code <= 67 || code >= 80 && code <= 82 || code >= 95) return <CloudRain className="w-24 h-24 text-blue-300" />;
    return <Cloud className="w-24 h-24 text-gray-300" />;
  };

  return (
    <div className="glass-panel p-8 mb-6">
      <div className="text-center">
        {location && (
          <div className="mb-4">
            <h1 className="text-4xl font-bold text-white">{location.name}</h1>
            <p className="text-xl text-white/80 mt-1">{location.country}</p>
          </div>
        )}

        <div className="flex justify-center mb-6">
          {getWeatherIcon(weather.weatherCode)}
        </div>

        <div className="mb-4">
          <div className="text-7xl font-bold text-white mb-2">
            {Math.round(weather.temperature)}°
          </div>
          <p className="text-2xl text-white/90">
            {getWeatherDescription(weather.weatherCode)}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/20">
          <div>
            <p className="text-white/70 text-sm mb-1">Wind</p>
            <p className="text-white text-xl font-semibold">{Math.round(weather.windSpeed)} km/h</p>
          </div>
          <div>
            <p className="text-white/70 text-sm mb-1">Humidity</p>
            <p className="text-white text-xl font-semibold">{weather.humidity}%</p>
          </div>
          <div>
            <p className="text-white/70 text-sm mb-1">Precipitation</p>
            <p className="text-white text-xl font-semibold">{weather.precipitation} mm</p>
          </div>
        </div>
      </div>
    </div>
  );
}
