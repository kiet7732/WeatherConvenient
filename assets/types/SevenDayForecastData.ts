import type { DailyWeather, SevenDayForecast } from './WeatherInterfaces';

export class SevenDayForecastData {
  private forecast: SevenDayForecast;

  constructor(forecast: SevenDayForecast) {
    this.forecast = forecast;
  }

  getDay(index: number): DailyWeather | null {
    return this.forecast.daily[index] || null;
  }

  getAllDays(): DailyWeather[] {
    return this.forecast.daily;
  }

  getMaxTemp(index: number): number | null {
    const day = this.getDay(index);
    return day ? day.temp.max : null;
  }

  getMinTemp(index: number): number | null {
    const day = this.getDay(index);
    return day ? day.temp.min : null;
  }

  getWeatherDescription(index: number): string | null {
    const day = this.getDay(index);
    return day && day.weather[0] ? day.weather[0].description : null;
  }

  getUVIndex(index: number): number | null {
    const day = this.getDay(index);
    // Kiểm tra nếu day không có trường uvi thì trả về null
    return day && typeof day.uvi === 'number' ? day.uvi : 0;
  }

  // Có thể bổ sung thêm các hàm tổng hợp khác nếu cần
} 