// weatherApi.ts
import { CurrentWeather } from '@/assets/types/weather';

const OPENWEATHER_API_KEY = 'bb503d07a0d327ae5aee574fc7db40c0'; // Thay bằng API key thực tế
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Lấy thời tiết hiện tại theo tên thành phố
export async function getCurrentWeatherByCity(city: string, units: 'metric' | 'imperial' = 'metric'): Promise<CurrentWeather> {
  const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=${units}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Không lấy được dữ liệu thời tiết hiện tại');
  return res.json();
}

// Lấy thời tiết hiện tại theo toạ độ
export async function getCurrentWeatherByCoords(lat: number, lon: number, units: 'metric' | 'imperial' = 'metric'): Promise<CurrentWeather> {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=${units}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Không lấy được dữ liệu thời tiết hiện tại theo toạ độ');
  return res.json();
}

// Lấy dự báo theo giờ (5 ngày, mỗi 3 giờ)
export async function getHourlyForecastByCity(city: string, units: 'metric' | 'imperial' = 'metric') {
  const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=${units}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Không lấy được dự báo theo giờ');
  return res.json();
}

// Lấy dự báo theo ngày (7 ngày) bằng One Call API (cần toạ độ)
export async function getDailyForecastByCoords(lat: number, lon: number, units: 'metric' | 'imperial' = 'metric') {
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${OPENWEATHER_API_KEY}&units=${units}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Không lấy được dự báo theo ngày');
  return res.json();
}