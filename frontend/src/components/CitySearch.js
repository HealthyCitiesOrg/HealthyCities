import { Search, MapPin } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "../hooks/useTranslation";

const CitySearch = ({ onCitySelect }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchCity = async (searchQuery) => {
    if (searchQuery.length < 3) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchQuery
        )}&format=json&limit=5&addressdetails=1`,
        {
          headers: {
            "User-Agent": "HealthyCities/2.0",
          },
        }
      );
      const data = await response.json();
      setResults(data || []);
    } catch (error) {
      console.error("Error searching city:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length >= 3) {
      searchCity(value);
    } else {
      setResults([]);
    }
  };

  const handleSelectCity = (city) => {
    onCitySelect({
      lat: parseFloat(city.lat),
      lng: parseFloat(city.lon),
      name: city.display_name,
    });
    setQuery("");
    setResults([]);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={t("citySearch.placeholder")}
          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {isSearching && (
        <div className="absolute top-full mt-2 w-full bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-3 text-white text-sm">
          {t("citySearch.searching")}
        </div>
      )}

      {results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden z-50 max-h-64 overflow-y-auto">
          {results.map((city, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectCity(city)}
              className="w-full flex items-start gap-3 p-3 hover:bg-white/10 transition-colors text-left"
            >
              <MapPin className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {city.display_name}
                </p>
                <p className="text-white/60 text-xs">
                  {parseFloat(city.lat).toFixed(6)},{" "}
                  {parseFloat(city.lon).toFixed(6)}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CitySearch;
