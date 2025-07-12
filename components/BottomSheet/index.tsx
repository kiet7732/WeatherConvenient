import React, { useState } from 'react';
import BottomSheetCustom from './BottomSheetForecast';
import { getFullWeatherDataByCity } from '@/api/openMeteoApi';
import { getCurrentDate } from '@/utils/weatherUtils';
import SevenDayWeatherScroll from '../DateTimeWeatherCard/SevenDayWeatherScroll';
import HourlyWeatherScroll from '../DateTimeWeatherCard/HourlyWeatherScroll';

const BottomSheetForecast = () => {

  const [hourlyData, setHourlyData] = useState<any[]>([]);
  const [sevenDayData, setSevenDayData] = useState<any[]>([]);

  React.useEffect(() => {
    async function fetchData() {
      const data = await getFullWeatherDataByCity('Hanoi', getCurrentDate());
      setHourlyData(data.hourly);
      setSevenDayData(data.sevenDay.daily); //lay mang
    }
    fetchData();
  }, []);
  return (
    <BottomSheetCustom
      hourlyContent={<HourlyWeatherScroll hourlyData={hourlyData} />}
      weeklyContent={<SevenDayWeatherScroll sevenDayData={sevenDayData} />}
    />

  );

};


export default BottomSheetForecast;