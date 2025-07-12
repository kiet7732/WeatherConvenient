interface WeatherMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface Wind {
  speed: number;
  deg: number;
}

interface Clouds {
  all: number;
}

interface Rain {
  '1h'?: number;
  '3h'?: number;
}

interface Snow {
  '1h'?: number;
  '3h'?: number;
}

interface Coord {
  lat: number;
  lon: number;
}

interface Sys {
  country: string;
}

export interface CurrentWeather { //public
  coord: Coord;
  weather: WeatherCondition[];
  main: WeatherMain;
  wind: Wind;
  clouds: Clouds;
  rain?: Rain;
  snow?: Snow;
  visibility: number;
  name: string;
  sys: Sys;
  uv?: number;
}

export interface OneCallCurrent {
  uvi: number;
  feels_like: number;
}

// forecast
export interface DailyWeather {
  dt: number; // timestamp
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  weather: WeatherCondition[];
  pressure: number;
  humidity: number;
  wind_speed: number;
  wind_deg: number;
  clouds: number;
  uvi: number;
  rain?: number;
  snow?: number;
}

export interface SevenDayForecast {
  daily: DailyWeather[];
  lat: number;
  lon: number;
  timezone: string;
}

export interface HourlyWeather {
  time: string; // ISO string, ví dụ: "2024-06-09T01:00"
  temperature: number;
  weathercode: number;
  main: string;         // Thêm trường này
  description: string;  // Thêm trường này
  icon: string;         // Thêm trường này
}

export interface OneDayHourlyWeather {
  date: string; // "2024-06-09"
  hours: HourlyWeather[]; // 24 phần tử
}

export interface FullWeatherData {
  coord: Coord;
  current: CurrentWeather; // Thời tiết hiện tại (Open-Meteo)
  currentFull: CurrentWeather; // Thời tiết hiện tại đầy đủ (Open-Meteo + WeatherAPI)
  sevenDay: SevenDayForecast;
  hourly: HourlyWeather[]; // 24 giờ của ngày truyền vào
}