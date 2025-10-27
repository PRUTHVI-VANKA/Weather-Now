import { Wind, Droplets, CloudRain, Compass } from 'lucide-react';
import { CurrentWeather } from '../types/weather';
import { getWindDirection } from '../services/weatherService';

interface WeatherDetailsProps {
  weather: CurrentWeather;
}

export default function WeatherDetails({ weather }: WeatherDetailsProps) {
  const totalPrecipitation = weather.rain + weather.showers + weather.snowfall;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="glass-panel p-6">
        <div className="flex items-center mb-3">
          <Wind className="w-6 h-6 text-white/90 mr-3" />
          <h3 className="text-lg font-semibold text-white">Wind</h3>
        </div>
        <p className="text-3xl font-bold text-white mb-2">{Math.round(weather.windSpeed)}</p>
        <p className="text-white/70 text-sm mb-2">km/h</p>
        {weather.windDirection !== undefined && (
          <div className="flex items-center mt-3 pt-3 border-t border-white/20">
            <Compass className="w-4 h-4 text-white/70 mr-2" />
            <span className="text-white/90">{getWindDirection(weather.windDirection)}</span>
          </div>
        )}
      </div>

      <div className="glass-panel p-6">
        <div className="flex items-center mb-3">
          <Droplets className="w-6 h-6 text-white/90 mr-3" />
          <h3 className="text-lg font-semibold text-white">Humidity</h3>
        </div>
        <p className="text-3xl font-bold text-white mb-2">{weather.humidity}</p>
        <p className="text-white/70 text-sm mb-2">%</p>
        <div className="mt-3 pt-3 border-t border-white/20">
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-blue-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${weather.humidity}%` }}
            />
          </div>
        </div>
      </div>

      <div className="glass-panel p-6">
        <div className="flex items-center mb-3">
          <CloudRain className="w-6 h-6 text-white/90 mr-3" />
          <h3 className="text-lg font-semibold text-white">Precipitation</h3>
        </div>
        <p className="text-3xl font-bold text-white mb-2">{weather.precipitation.toFixed(1)}</p>
        <p className="text-white/70 text-sm mb-2">mm</p>
        {totalPrecipitation > 0 && (
          <div className="mt-3 pt-3 border-t border-white/20 text-sm">
            {weather.rain > 0 && <p className="text-white/80">Rain: {weather.rain.toFixed(1)} mm</p>}
            {weather.showers > 0 && <p className="text-white/80">Showers: {weather.showers.toFixed(1)} mm</p>}
            {weather.snowfall > 0 && <p className="text-white/80">Snow: {weather.snowfall.toFixed(1)} mm</p>}
          </div>
        )}
      </div>

      <div className="glass-panel p-6">
        <div className="flex items-center mb-3">
          <Droplets className="w-6 h-6 text-white/90 mr-3" />
          <h3 className="text-lg font-semibold text-white">Feels Like</h3>
        </div>
        <p className="text-3xl font-bold text-white mb-2">
          {Math.round(weather.temperature - (weather.windSpeed * 0.2))}°
        </p>
        <p className="text-white/70 text-sm">Adjusted for wind</p>
        <div className="mt-3 pt-3 border-t border-white/20 text-sm text-white/80">
          Actual: {Math.round(weather.temperature)}°
        </div>
      </div>
    </div>
  );
}
