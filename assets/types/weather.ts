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
  }
  
  export interface OneCallCurrent {
    uvi: number;
    feels_like: number;
  }