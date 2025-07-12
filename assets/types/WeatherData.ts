import { CurrentWeather } from "./WeatherInterfaces";


export class WeatherData {

    private weather: CurrentWeather;
    private oneCall: any;
    coord: any;

    constructor(weather: CurrentWeather, oneCall: any) {
        this.weather = weather;
        this.oneCall = oneCall;
        this.coord = weather.coord;
    }
    // Lấy dữ liệu cơ bản
    getTemperature(): number {
        return Math.round(this.weather.main.temp);
    }

    getFeelsLike(): number {
        return Math.round(this.weather.main.feels_like || this.oneCall.feels_like);
    }

    getHighTemp(): number {
        return Math.round(this.weather.main.temp_max);
    }

    getLowTemp(): number {
        return Math.round(this.weather.main.temp_min);
    }

    getCity(): string {
        return `${this.weather.name}, ${this.weather.sys.country}`;
    }

    getCondition(): string {
        const w = this.weather.weather;
        if (w && Array.isArray(w) && w.length > 0 && typeof w[0].description === 'string') {
            const desc = w[0].description;
            return desc.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }
        return 'Không xác định';
    }

    getPressure(): number {
        return this.weather.main.pressure;
    }

    getHumidity(): number {
        return this.weather.main.humidity;
    }

    getDewPoint(): number {
        return Math.round(this.weather.main.temp - ((100 - this.weather.main.humidity) / 5));
    }

    getWindSpeed(): number {
        return this.weather.wind.speed;
    }

    getWindDirection(): number {
        return this.weather.wind.deg;
    }

    getCloudiness(): number {
        return this.weather.clouds.all;
    }

    getVisibility(): number {
        return this.weather.visibility / 1000; // Chuyển từ mét sang km
    }

    getUVIndex(): number {
        return this.oneCall.uvi || 0;
    }

    getRainfall(): number {
        return this.weather.rain?.['1h'] || 0;
    }

    getSnowfall(): number {
        return this.weather.snow?.['1h'] || 0;
    }

    // Lấy URL icon từ OpenWeatherMap (giữ nguyên cho icon online)
    // getIconUrl(): { uri: string } {
    // return { uri: `https://openweathermap.org/img/wn/${this.weather.weather[0].icon}@4x.png` };
    // }

    getCustomIcon(): any {
        const weatherCode = this.weather.weather[0].id;
        // Xác định ban ngày hay ban đêm
        const hour = new Date().getHours();
        const isDay = hour >= 6 && hour < 18;
        // Map weatherCode sang icon tuỳ chỉnh cho ngày và đêm
        const iconMap: Record<number, { day: any; night: any }> = {
            0: { day: require('assets/iconWeather/clear_sky_day.svg'), night: require('assets/iconWeather/clear_sky_night.svg') }, // Trời quang đãng
            1: { day: require('assets/iconWeather/clear_sky_day.svg'), night: require('assets/iconWeather/clear_sky_night.svg') }, // Gần như quang đãng
            2: { day: require('assets/iconWeather/partly_cloud.svg'), night: require('assets/iconWeather/partly_cloud.svg') }, // Có mây từng phần
            3: { day: require('assets/iconWeather/partly_cloud.svg'), night: require('assets/iconWeather/partly_cloud.svg') }, // Nhiều mây
            45: { day: require('assets/iconWeather/fog.svg'), night: require('assets/iconWeather/fog.svg') }, // Sương mù
            48: { day: require('assets/iconWeather/fog.svg'), night: require('assets/iconWeather/fog.svg') }, // Sương mù đóng băng
            51: { day: require('assets/iconWeather/drizzle.svg'), night: require('assets/iconWeather/drizzle.svg') }, // Mưa phùn nhẹ
            53: { day: require('assets/iconWeather/drizzle.svg'), night: require('assets/iconWeather/drizzle.svg') }, // Mưa phùn
            55: { day: require('assets/iconWeather/drizzle1.svg'), night: require('assets/iconWeather/drizzle1.svg') }, // Mưa phùn nặng
            56: { day: require('assets/iconWeather/freezing_rain.svg'), night: require('assets/iconWeather/freezing_rain.svg') }, // Mưa phùn đóng băng nhẹ
            57: { day: require('assets/iconWeather/freezing_rain.svg'), night: require('assets/iconWeather/freezing_rain.svg') }, // Mưa phùn đóng băng nặng
            61: { day: require('assets/iconWeather/rainy_cloud_night.svg'), night: require('assets/iconWeather/rainy_cloud_night.svg') }, // Mưa nhẹ
            63: { day: require('assets/iconWeather/rainy_cloud_night.svg'), night: require('assets/iconWeather/rainy_cloud_night.svg') }, // Mưa vừa
            65: { day: require('assets/iconWeather/rainy_cloud_night1.svg'), night: require('assets/iconWeather/rainy_cloud_night1.svg') }, // Mưa nặng
            66: { day: require('assets/iconWeather/freezing_rain.svg'), night: require('assets/iconWeather/freezing_rain.svg') }, // Mưa đóng băng nhẹ
            67: { day: require('assets/iconWeather/freezing_rain.svg'), night: require('assets/iconWeather/freezing_rain.svg') }, // Mưa đóng băng nặng
            71: { day: require('assets/iconWeather/snow.svg'), night: require('assets/iconWeather/snow.svg') }, // Tuyết rơi nhẹ
            73: { day: require('assets/iconWeather/snow.svg'), night: require('assets/iconWeather/snow.svg') }, // Tuyết rơi vừa
            75: { day: require('assets/iconWeather/snow.svg'), night: require('assets/iconWeather/snow.svg') }, // Tuyết rơi nặng
            77: { day: require('assets/iconWeather/snow1.svg'), night: require('assets/iconWeather/snow1.svg') }, // Hạt tuyết
            80: { day: require('assets/iconWeather/rain_showers_night.svg'), night: require('assets/iconWeather/rain_showers_night.svg') }, // Mưa rào nhẹ
            81: { day: require('assets/iconWeather/rain_showers_night.svg'), night: require('assets/iconWeather/rain_showers_night.svg') }, // Mưa rào vừa
            82: { day: require('assets/iconWeather/rain_showers_night.svg'), night: require('assets/iconWeather/rain_showers_night.svg') }, // Mưa rào nặng
            85: { day: require('assets/iconWeather/snow.svg'), night: require('assets/iconWeather/snow.svg') }, // Mưa tuyết nhẹ
            86: { day: require('assets/iconWeather/snow.svg'), night: require('assets/iconWeather/snow.svg') }, // Mưa tuyết nặng
            95: { day: require('assets/iconWeather/snow.svg'), night: require('assets/iconWeather/snow.svg') }, // Dông
            96: { day: require('assets/iconWeather/snow.svg'), night: require('assets/iconWeather/snow.svg') }, // Dông nhẹ
            99: { day: require('assets/iconWeather/snow.svg'), night: require('assets/iconWeather/snow.svg') }, // Dông nặng
        };
        const iconSet = iconMap[weatherCode] || { day: require('assets/iconWeather/cloud.svg'), night: require('assets/iconWeather/cloud.svg') };
        return isDay ? iconSet.day : iconSet.night;
    }

}

