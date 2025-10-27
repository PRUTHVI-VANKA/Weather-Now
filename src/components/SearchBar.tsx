import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { GeocodingResult } from '../types/weather';
import { searchCities } from '../services/weatherService';

interface SearchBarProps {
  onLocationSelect: (location: GeocodingResult) => void;
}

export default function SearchBar({ onLocationSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.length >= 2) {
        setIsLoading(true);
        const cities = await searchCities(query);
        setResults(cities);
        setIsOpen(true);
        setIsLoading(false);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleSelect = (location: GeocodingResult) => {
    onLocationSelect(location);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    // 💡 FIX 1: Add a very high z-index to the main wrapper
    // This establishes a stacking context that sits above all glass-panels and backgrounds.
    <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto mb-8 z-[1000]"> 
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city..."
          className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 text-lg"
        />
      </div>

      {isOpen && (
        // 💡 FIX 2: Ensure the dropdown container has the necessary z-index inheritance
        // Since the parent now has z-[1000], this absolute div will inherit that high stacking order.
        <div className="absolute w-full mt-2 bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
          {isLoading ? (
            <div className="px-4 py-3 text-white/70">Searching...</div>
          ) : results.length > 0 ? (
            <ul>
              {results.map((result) => (
                <li key={result.id}>
                  <button
                    onClick={() => handleSelect(result)}
                    className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors text-white flex flex-col"
                  >
                    <span className="font-semibold">{result.name}</span>
                    <span className="text-sm text-white/70">
                      {result.admin1 ? `${result.admin1}, ` : ''}{result.country}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-white/70">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}