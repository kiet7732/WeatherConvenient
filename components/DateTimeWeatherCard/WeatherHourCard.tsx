import { IS_MOBILE } from '@/constants/Layout';
import { getCurrentHourString, isCurrentDayGet } from '@/utils/weatherUtils';
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface WeatherHourCardProps {
  date: string; // ví dụ: "2 AM"
  temperature: number; // ví dụ: 18
  icon: any; // require('...') hoặc uri
  mode?: 'hour' | 'day';
}

const DateTimeWeatherCard: React.FC<WeatherHourCardProps> = ({
  date,
  temperature,
  icon,
  mode = 'hour',
}) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Hàm kiểm tra active
    const checkActive = () => {
      if (mode === 'hour') {
        setIsActive(date === getCurrentHourString());
      } else if (mode === 'day') {
        setIsActive(isCurrentDayGet(date));
      }
    };

    checkActive(); // Kiểm tra lần đầu

    // Cập nhật mỗi phút (hoặc mỗi 10s cho nhạy)

    const interval = setInterval(checkActive, mode === 'hour' ? 60 * 1000 : 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [date, mode]);

  return (
    <View style={[styles.container, isActive && styles.activeContainer]}>
      <Text style={styles.hour}>{date}</Text>
      <Image source={icon} style={styles.icon} resizeMode="contain" />
      <Text style={styles.temp}>{temperature}°</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Responsive width và height
    width: IS_MOBILE ? 60 : 80,
    height: IS_MOBILE ? 130 : 180,
    borderRadius: IS_MOBILE ? 30 : 40,
    backgroundColor: "#48319d",
    borderWidth: 2,
    borderColor: "#ffffff33",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: IS_MOBILE ? 16 : 24,
    paddingHorizontal: IS_MOBILE ? 8 : 12,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    marginRight: IS_MOBILE ? 4 : 6,
    marginLeft: IS_MOBILE ? 4 : 6,
    // Responsive elevation cho Android
    elevation: IS_MOBILE ? 5 : 8,
    zIndex: 10,
  },
  activeContainer: {
    backgroundColor: "#392c73",
    borderColor: "#ffffff80",
  },
  hour: {
    color: "#fff",
    fontSize: IS_MOBILE ? 12 : 16,
    fontWeight: "600",
    letterSpacing: 1,
  },
  icon: {
    width: IS_MOBILE ? 32 : 48,
    height: IS_MOBILE ? 32 : 48,
    marginVertical: IS_MOBILE ? 6 : 12,
  },
  temp: {
    color: "#fff",
    fontSize: IS_MOBILE ? 14 : 20,
    fontWeight: "400",
    letterSpacing: 1,
  },
});

export default DateTimeWeatherCard;
function isCurrentDay(date: string): React.SetStateAction<boolean> {
  throw new Error('Function not implemented.');
}

