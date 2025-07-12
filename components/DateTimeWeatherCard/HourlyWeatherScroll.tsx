import { formatTime, getCurrentHourIndex, getWeatherIconByCode } from '@/utils/weatherUtils';
import React, { useEffect, useRef } from "react";
import { Dimensions, ScrollView } from "react-native";
import WeatherHourCard from '../DateTimeWeatherCard/WeatherHourCard';

const CARD_WIDTH = 60 + 8; // width + margin, sửa lại nếu cần
const SCREEN_WIDTH = Dimensions.get('window').width;

export function HourlyWeatherScroll({ hourlyData }: { hourlyData: any[] }) {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!hourlyData || hourlyData.length === 0) return;
    const currentIndex = getCurrentHourIndex(hourlyData);
    if (currentIndex !== -1 && scrollRef.current) {
      const offset = CARD_WIDTH * currentIndex - SCREEN_WIDTH / 2 + CARD_WIDTH / 2;
      scrollRef.current.scrollTo({ x: Math.max(0, offset), animated: true });
    }
  }, [hourlyData]);

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
      {hourlyData.map((hour, index) => (
        <WeatherHourCard
          key={index}
          date={formatTime(hour.time)}
          temperature={Math.round(hour.temperature)}
          icon={getWeatherIconByCode(hour.weathercode, hour.time)}
        />
      ))}
    </ScrollView>
  );
}

export default HourlyWeatherScroll;