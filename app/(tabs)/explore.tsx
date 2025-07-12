import { getFullWeatherDataByCity } from '@/api/openMeteoApi';
import BottomSheetForecast from '@/components/BottomSheet';
import { getCurrentDate } from '@/utils/weatherUtils';
import React from 'react';


export default function ExploreScreen() {

  React.useEffect(() => {
    async function fetchData() {
      const data = await getFullWeatherDataByCity('Hanoi', getCurrentDate());
      console.log(data.current);      // Thời tiết hiện tại
      console.log(data.currentFull);  // Thời tiết hiện tại đầy đủ
      console.log(data.sevenDay);     // Dự báo 7 ngày
      console.log(data.hourly);       // 24 giờ của ngày

    }
    fetchData();
  }, []);


  return (


    <BottomSheetForecast />

  );
}


