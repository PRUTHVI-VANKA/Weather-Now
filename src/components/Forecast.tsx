import { Cloud, CloudRain, CloudSnow, Sun } from 'lucide-react';
import { DailyForecast } from '../types/weather';
import { getWeatherDescription } from '../services/weatherService';

interface ForecastProps {
  forecast: DailyForecast;
}

export default function Forecast({ forecast }: ForecastProps) {
  const getWeatherIcon = (code: number) => {
    if (code === 0 || code === 1) return <Sun className="w-8 h-8 text-yellow-300" />;
    if (code >= 71 && code <= 77 || code >= 85 && code <= 86) return <CloudSnow className="w-8 h-8 text-blue-200" />;
    if (code >= 51 && code <= 67 || code >= 80 && code <= 82 || code >= 95) return <CloudRain className="w-8 h-8 text-blue-300" />;
    return <Cloud className="w-8 h-8 text-gray-300" />;
  };

  const formatDate = (dateString: string, index: number) => {
    const date = new Date(dateString);
    if (index === 0) return 'Today';
    if (index === 1) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="glass-panel p-6">
      <h2 className="text-2xl font-bold text-white mb-6">10-Day Forecast</h2>
      <div className="space-y-3">
        {forecast.time.slice(0, 10).map((date, index) => (
          <div
            key={date}
            className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center space-x-4 flex-1">
              <div className="w-32">
                <p className="text-white font-semibold">{formatDate(date, index)}</p>
              </div>
              <div className="flex items-center space-x-3">
                {getWeatherIcon(forecast.weatherCode[index])}
                <p className="text-white/80 text-sm hidden md:block">
                  {getWeatherDescription(forecast.weatherCode[index])}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {forecast.precipitationProbability[index] > 0 && (
                <div className="text-right hidden sm:block">
                  <p className="text-blue-300 text-sm">
                    {forecast.precipitationProbability[index]}%
                  </p>
                  <p className="text-white/60 text-xs">rain</p>
                </div>
              )}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-white font-semibold text-lg">
                    {Math.round(forecast.tempMax[index])}°
                  </p>
                  <p className="text-white/60 text-sm">High</p>
                </div>
                <div className="text-right">
                  <p className="text-white/70 font-semibold text-lg">
                    {Math.round(forecast.tempMin[index])}°
                  </p>
                  <p className="text-white/60 text-sm">Low</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
