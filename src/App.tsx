import { useState, useEffect } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import DynamicBackground from './components/DynamicBackground';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import WeatherDetails from './components/WeatherDetails';
import Forecast from './components/Forecast';
import { WeatherData } from './types/weather';
import { getWeatherData, getWeatherCondition } from './services/weatherService';
import { GeocodingResult } from './types/weather';

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');

  const fetchWeatherByCoords = async (lat: number, lon: number, locationName?: string, country?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWeatherData(lat, lon, locationName, country);
      setWeather(data);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const requestGeolocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationPermission('granted');
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationPermission('denied');
          fetchWeatherByCoords(40.7128, -74.0060, 'New York', 'USA');
        }
      );
    } else {
      setLocationPermission('denied');
      fetchWeatherByCoords(40.7128, -74.0060, 'New York', 'USA');
    }
  };

  useEffect(() => {
    requestGeolocation();
  }, []);

  const handleLocationSelect = (location: GeocodingResult) => {
    fetchWeatherByCoords(location.latitude, location.longitude, location.name, location.country);
  };

  const handleUseMyLocation = () => {
    requestGeolocation();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-800 flex items-center justify-center">
        <div className="text-center glass-panel p-8 max-w-md mx-4">
          <p className="text-white text-xl mb-4">{error || 'Failed to load weather data'}</p>
          <button
            onClick={() => requestGeolocation()}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const condition = getWeatherCondition(weather.current.weatherCode);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <DynamicBackground condition={condition} />

      <div className="relative z-10 min-h-screen px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-end mb-4">
            <button
              onClick={handleUseMyLocation}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span>Use My Location</span>
            </button>
          </div>

          <SearchBar onLocationSelect={handleLocationSelect} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-1">
              <CurrentWeather weather={weather.current} location={weather.location} />
            </div>
            <div className="lg:col-span-2">
              <WeatherDetails weather={weather.current} />
            </div>
          </div>

          <Forecast forecast={weather.daily} />
        </div>
      </div>
    </div>
  );
}

export default App;
