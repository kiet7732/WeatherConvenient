// Utility function để map weathercode sang icon (từ WeatherData.getCustomIcon)
export const getWeatherIconByCode = (weatherCode: number, time: string) => {
  const hour = new Date(time).getHours();
  const isDay = hour >= 6 && hour < 18;

  const iconMap: Record<number, { day: any; night: any }> = {
    0: { day: require('assets/iconWeather/clear_sky_day.svg'), night: require('assets/iconWeather/clear_sky_night.svg') },
    1: { day: require('assets/iconWeather/clear_sky_day.svg'), night: require('assets/iconWeather/clear_sky_night.svg') },
    2: { day: require('assets/iconWeather/partly_cloud.svg'), night: require('assets/iconWeather/partly_cloud.svg') },
    3: { day: require('assets/iconWeather/partly_cloud.svg'), night: require('assets/iconWeather/partly_cloud.svg') },
    45: { day: require('assets/iconWeather/fog.svg'), night: require('assets/iconWeather/fog.svg') },
    48: { day: require('assets/iconWeather/fog.svg'), night: require('assets/iconWeather/fog.svg') },
    51: { day: require('assets/iconWeather/drizzle.svg'), night: require('assets/iconWeather/drizzle.svg') },
    53: { day: require('assets/iconWeather/drizzle.svg'), night: require('assets/iconWeather/drizzle.svg') },
    55: { day: require('assets/iconWeather/drizzle1.svg'), night: require('assets/iconWeather/drizzle1.svg') },
    56: { day: require('assets/iconWeather/freezing_rain.svg'), night: require('assets/iconWeather/freezing_rain.svg') },
    57: { day: require('assets/iconWeather/freezing_rain.svg'), night: require('assets/iconWeather/freezing_rain.svg') },
    61: { day: require('assets/iconWeather/rainy_cloud_night.svg'), night: require('assets/iconWeather/rainy_cloud_night.svg') },
    63: { day: require('assets/iconWeather/rainy_cloud_night.svg'), night: require('assets/iconWeather/rainy_cloud_night.svg') },
    65: { day: require('assets/iconWeather/rainy_cloud_night1.svg'), night: require('assets/iconWeather/rainy_cloud_night1.svg') },
    66: { day: require('assets/iconWeather/freezing_rain.svg'), night: require('assets/iconWeather/freezing_rain.svg') },
    67: { day: require('assets/iconWeather/freezing_rain.svg'), night: require('assets/iconWeather/freezing_rain.svg') },
    71: { day: require('assets/iconWeather/snow.svg'), night: require('assets/iconWeather/snow.svg') },
    73: { day: require('assets/iconWeather/snow.svg'), night: require('assets/iconWeather/snow.svg') },
    75: { day: require('assets/iconWeather/snow.svg'), night: require('assets/iconWeather/snow.svg') },
    77: { day: require('assets/iconWeather/snow1.svg'), night: require('assets/iconWeather/snow1.svg') },
    80: { day: require('assets/iconWeather/rain_showers_night.svg'), night: require('assets/iconWeather/rain_showers_night.svg') },
    81: { day: require('assets/iconWeather/rain_showers_night.svg'), night: require('assets/iconWeather/rain_showers_night.svg') },
    82: { day: require('assets/iconWeather/rain_showers_night.svg'), night: require('assets/iconWeather/rain_showers_night.svg') },
    85: { day: require('assets/iconWeather/snow.svg'), night: require('assets/iconWeather/snow.svg') },
    86: { day: require('assets/iconWeather/snow.svg'), night: require('assets/iconWeather/snow.svg') },
    95: { day: require('assets/iconWeather/snow.svg'), night: require('assets/iconWeather/snow.svg') },
    96: { day: require('assets/iconWeather/snow.svg'), night: require('assets/iconWeather/snow.svg') },
    99: { day: require('assets/iconWeather/snow.svg'), night: require('assets/iconWeather/snow.svg') },
  };

  const iconSet = iconMap[weatherCode] || { day: require('assets/iconWeather/cloud.svg'), night: require('assets/iconWeather/cloud.svg') };
  return isDay ? iconSet.day : iconSet.night;
};

// Function để format thời gian từ ISO string sang "2 AM" format
export const formatTime = (timeString: string) => {
  const date = new Date(timeString);
  const hour = date.getHours();
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour} ${ampm}`;
};

export function getCurrentDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0, nên +1
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Function để format ngày từ timestamp sang "Mon", "Tue", etc.
export const formatDay = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const days = ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon' ];
  return days[date.getDay()];
};

// Function để tạo time string cho ngày (12:00 giữa ngày)
export const createDayTime = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}T12:00`;
};

export function getCurrentHourString() {
  const now = new Date();
  let hour = now.getHours();
  const ampm = hour >= 12 ? 'PM' : 'AM';
  let displayHour = hour % 12;
  if (displayHour === 0) displayHour = 12;
  return `${displayHour} ${ampm}`;
}

export function getCurrentHourIndex(hourlyData: any[]): number {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const currentHour = now.getHours();
  return hourlyData.findIndex(item => {
    const [dateStr] = item.time.split('T');
    const itemHour = new Date(item.time).getHours();
    return dateStr === today && itemHour === currentHour;
  });
}

export function getCurrentDayIndex(sevenDayData: any[]): number {
  const today = new Date();
  // so sánh theo timestamp ngày (không tính giờ)
  return sevenDayData.findIndex(day => {
    const dayDate = new Date(day.dt * 1000);
    return (
      dayDate.getDate() === today.getDate() &&
      dayDate.getMonth() === today.getMonth() &&
      dayDate.getFullYear() === today.getFullYear()
    );
  });
}

export function isCurrentDayGet(date: string): boolean {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  return date === days[today.getDay()];
}