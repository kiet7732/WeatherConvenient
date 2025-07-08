// api/weatherApiSupplement.ts
// Lấy dữ liệu bổ sung từ WeatherAPI (weatherapi.com) cho các trường mà Open-Meteo không có

const WEATHERAPI_KEY = 'f87fb79d35d447aea3a133645250807 '; // Thay bằng API key thực tế
const BASE_URL = 'https://api.weatherapi.com/v1';

// Lấy thông tin bổ sung theo toạ độ hoặc tên thành phố
export async function getWeatherSupplementByCoords(lat: number, lon: number) {
  const url = `${BASE_URL}/current.json?key=${WEATHERAPI_KEY}&q=${lat},${lon}&aqi=no`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Không lấy được dữ liệu bổ sung từ WeatherAPI');
  const data = await res.json();
  return {
    humidity: data.current.humidity, // %
    pressure: data.current.pressure_mb, // hPa
    clouds: data.current.cloud, // %
    visibility: data.current.vis_km, // km
    feels_like: data.current.feelslike_c, // °C
    uv: data.current.uv, // UV index
    wind_gust: data.current.gust_kph, // km/h
    // ... bổ sung thêm trường nếu cần
  };
}

// Lấy thông tin bổ sung theo tên thành phố
export async function getWeatherSupplementByCity(city: string) {
  const url = `${BASE_URL}/current.json?key=${WEATHERAPI_KEY}&q=${encodeURIComponent(city)}&aqi=no`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Không lấy được dữ liệu bổ sung từ WeatherAPI');
  const data = await res.json();
  return {
    humidity: data.current.humidity,
    pressure: data.current.pressure_mb,
    clouds: data.current.cloud,
    visibility: data.current.vis_km,
    feels_like: data.current.feelslike_c,
    uv: data.current.uv,
    wind_gust: data.current.gust_kph,
  };
} 