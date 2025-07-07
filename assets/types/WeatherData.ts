import type { CurrentWeather } from '../types/weather';

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

    // Lấy đường dẫn chuỗi icon SVG nội bộ từ iconMap (dùng cho debug hoặc hiển thị text)
    getIconUrl(): string {
        const icon = this.getCustomIcon();
        // icon có dạng: { default: ... } hoặc là số (nếu require trả về số), nên lấy tên file từ key
        // Đơn giản nhất: trả về tên file dựa trên logic đã chọn
        const weatherId = this.weather.weather[0].id;
        const cloudiness = this.weather.clouds.all;
        const isNight = new Date().getHours() >= 18 || new Date().getHours() < 6;
        if (weatherId >= 200 && weatherId <= 232) return 'thunderstorm.svg';
        if (weatherId >= 500 && weatherId <= 504) return 'rainy_cloud.svg';
        if (weatherId === 800) return isNight ? 'moon_cloud_stars.svg' : 'light_clouds_sun.svg';
        if (weatherId >= 801 && weatherId <= 804) {
            if (cloudiness === 100) return 'rainy_cloud1.svg';
            return 'cloudy_sun.svg';
        }
        return '5.svg';
    }

    // Chọn icon tùy chỉnh từ bộ sưu tập của bạn
    private iconMap: Record<string, any> = {
        thunderstorm: require('assets/images/thunderstorm.svg'),
        rainy_cloud: require('assets/images/rainy_cloud.svg'),
        rainy_cloud1: require('assets/images/rainy_cloud1.svg'),
        moon_cloud_stars: require('assets/images/moon_cloud_stars.svg'),
        light_clouds_sun: require('assets/images/light_clouds_sun.svg'),
        cloudy_sun: require('assets/images/5.svg'),
        '5': require('assets/images/5.svg'),
    };

    getCustomIcon(): any {
        const weatherId = this.weather.weather[0].id;
        const cloudiness = this.weather.clouds.all;
        const isNight = new Date().getHours() >= 18 || new Date().getHours() < 6;

        if (weatherId >= 200 && weatherId <= 232) return this.iconMap.thunderstorm;
        if (weatherId >= 500 && weatherId <= 504) return this.iconMap.rainy_cloud;
        if (weatherId === 800) return isNight ? this.iconMap.moon_cloud_stars : this.iconMap.light_clouds_sun;
        if (weatherId >= 801 && weatherId <= 804) {
            if (cloudiness === 100) return this.iconMap.rainy_cloud1;
            return this.iconMap.cloudy_sun;
        }
        return this.iconMap['5'];
    }
}

