import { WeatherCondition } from '../types/weather';

interface DynamicBackgroundProps {
  condition: WeatherCondition;
}

export default function DynamicBackground({ condition }: DynamicBackgroundProps) {
  const getBackgroundClass = () => {
    switch (condition) {
      case 'sunny':
        return 'bg-sunny';
      case 'rainy':
        return 'bg-rainy';
      case 'snowy':
        return 'bg-snowy';
      case 'cloudy':
        return 'bg-cloudy';
      default:
        return 'bg-cloudy';
    }
  };

  return (
    <>
      <div className={`fixed inset-0 -z-10 ${getBackgroundClass()} transition-all duration-1000`} />

      {condition === 'sunny' && (
        <div className="fixed inset-0 -z-10 sun-glow" />
      )}

      {condition === 'rainy' && (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="raindrop"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      {condition === 'snowy' && (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="snowflake"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`,
                fontSize: `${10 + Math.random() * 10}px`,
              }}
            >
              ❄
            </div>
          ))}
        </div>
      )}

      {condition === 'cloudy' && (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="cloud cloud-1" />
          <div className="cloud cloud-2" />
          <div className="cloud cloud-3" />
        </div>
      )}
    </>
  );
}
