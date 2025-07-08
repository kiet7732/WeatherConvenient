import { weatherCodeMap } from '@/assets/types/weatherCodeMap';
import type { CurrentWeather } from '@/assets/types/WeatherInterfaces';
import { DailyWeather, SevenDayForecast } from '@/assets/types/WeatherInterfaces';
import { getWeatherSupplementByCity } from './weatherApiSupplement';

// Lấy toạ độ từ tên thành phố (Open-Meteo geocoding)
export async function getCoordsByCity(city: string): Promise<{ lat: number; lon: number; name: string; country: string }> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=vi&format=json`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.results || data.results.length === 0) throw new Error('Không tìm thấy thành phố');
  const result = data.results[0];
  return { lat: result.latitude, lon: result.longitude, name: result.name, country: result.country };
}

// Lấy dự báo 7 ngày từ Open-Meteo
export async function getSevenDayForecastByCoords(lat: number, lon: number): Promise<SevenDayForecast> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum,uv_index_max,wind_speed_10m_max&timezone=auto`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.daily) throw new Error('Không lấy được dữ liệu dự báo');

  const daily: DailyWeather[] = data.daily.time.map((date: string, idx: number) => {
    const weatherCode = data.daily.weathercode[idx];
    const weatherMap = weatherCodeMap[weatherCode] || { main: 'Unknown', description: 'Không xác định', icon: '01d' };
    return {
      dt: Math.floor(new Date(date).getTime() / 1000),
      temp: {
        day: (data.daily.temperature_2m_max[idx] + data.daily.temperature_2m_min[idx]) / 2,
        min: data.daily.temperature_2m_min[idx],
        max: data.daily.temperature_2m_max[idx],
        night: data.daily.temperature_2m_min[idx],
        eve: data.daily.temperature_2m_min[idx],
        morn: data.daily.temperature_2m_min[idx],
      },
      weather: [{
        id: weatherCode,
        main: weatherMap.main,
        description: weatherMap.description,
        icon: weatherMap.icon,
      }],
      pressure: 1013,
      humidity: 70,
      wind_speed: data.daily.wind_speed_10m_max ? data.daily.wind_speed_10m_max[idx] : 0,
      wind_deg: 0,
      clouds: 0,
      uvi: data.daily.uv_index_max ? data.daily.uv_index_max[idx] : 0,
      rain: data.daily.precipitation_sum ? data.daily.precipitation_sum[idx] : 0,
      snow: 0,
    };
  });

  return {
    daily,
    lat: data.latitude,
    lon: data.longitude,
    timezone: data.timezone,
  };
}

// Lấy thời tiết hiện tại theo tên thành phố (Open-Meteo)
export async function getCurrentWeatherByCity(city: string): Promise<CurrentWeather> {
  // Bước 1: Lấy toạ độ từ tên thành phố
  const { lat, lon, name, country } = await getCoordsByCity(city);
  // Bước 2: Gọi API Open-Meteo để lấy thời tiết hiện tại
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.current_weather) throw new Error('Không lấy được dữ liệu thời tiết hiện tại');
  const weatherCode = data.current_weather.weathercode;
  const weatherMap = weatherCodeMap[weatherCode] || { main: 'Unknown', description: 'Không xác định', icon: '01d' };

  // Map về interface CurrentWeather
  const current: CurrentWeather = {
    coord: { lat, lon },
    weather: [{
      id: weatherCode,
      main: weatherMap.main,
      description: weatherMap.description,
      icon: weatherMap.icon,
    }],
    main: {
      temp: data.current_weather.temperature,
      feels_like: data.current_weather.temperature, // Open-Meteo không có feels_like riêng
      temp_min: data.current_weather.temperature,   // Không có min/max, dùng tạm
      temp_max: data.current_weather.temperature,
      pressure: 1013, // Open-Meteo không có, có thể lấy từ OpenWeatherMap nếu muốn
      humidity: 70,   // Open-Meteo không có, có thể lấy từ OpenWeatherMap nếu muốn
    },
    wind: {
      speed: data.current_weather.windspeed,
      deg: data.current_weather.winddirection,
    },
    clouds: { all: 0 }, // Open-Meteo không có, có thể lấy từ OpenWeatherMap nếu muốn
    rain: undefined,    // Open-Meteo không có
    snow: undefined,    // Open-Meteo không có
    visibility: 10000,  // Open-Meteo không có, mặc định 10km
    name,
    sys: { country },
  };
  return current;
}

// Lấy thời tiết hiện tại đầy đủ (Open-Meteo + bổ sung từ WeatherAPI)
export async function getFullCurrentWeatherByCity(city: string): Promise<CurrentWeather> {
  // Lấy dữ liệu từ Open-Meteo
  const openMeteoCurrent = await getCurrentWeatherByCity(city);
  // Lấy dữ liệu bổ sung từ WeatherAPI
  type Supplement = {
    humidity?: number;
    pressure?: number;
    clouds?: number;
    visibility?: number;
    feels_like?: number;
  };
  let supplement: Supplement = {};
  try {
    supplement = await getWeatherSupplementByCity(city);
  } catch (e) {
    supplement = {};
  }
  // Gộp dữ liệu
  return {
    ...openMeteoCurrent,
    main: {
      ...openMeteoCurrent.main,
      humidity: supplement.humidity ?? openMeteoCurrent.main.humidity,
      pressure: supplement.pressure ?? openMeteoCurrent.main.pressure,
      feels_like: supplement.feels_like ?? openMeteoCurrent.main.feels_like,
    },
    clouds: {
      all: supplement.clouds ?? openMeteoCurrent.clouds.all,
    },
    visibility: supplement.visibility ?? openMeteoCurrent.visibility,
  };
} 