import { formatDay, getCurrentDayIndex } from '@/utils/weatherUtils';
import React, { useEffect, useRef } from "react";
import { Dimensions, ScrollView } from "react-native";
import WeatherHourCard from '../DateTimeWeatherCard/WeatherHourCard';

const CARD_WIDTH = 60; // width + margin, sửa lại nếu cần
const SCREEN_WIDTH = Dimensions.get('window').width;


export function SevenDayWeatherScroll({ sevenDayData }: { sevenDayData: any[] }) {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!sevenDayData || sevenDayData.length === 0) return;
    const currentIndex = getCurrentDayIndex(sevenDayData);
    if (currentIndex !== -1 && scrollRef.current) {
      const offset = CARD_WIDTH * currentIndex - SCREEN_WIDTH / 2 + CARD_WIDTH / 2;
      scrollRef.current.scrollTo({ x: Math.max(0, offset), animated: true });
    }
  }, [sevenDayData]);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1, // Quan trọng để căn giữa khi tổng width nhỏ hơn màn hình
      }}
    >
      {sevenDayData.map((day, index) => (
        <WeatherHourCard
          key={index}
          date={formatDay(day.dt)}
          temperature={Math.round(day.temp.day)}
          icon={day.weather[0].icon}
          mode="day"
        />
      ))}
    </ScrollView>
  );
}

export default SevenDayWeatherScroll;