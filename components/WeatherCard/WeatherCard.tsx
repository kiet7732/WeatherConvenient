import { getFullCurrentWeatherByCity } from '@/api/openMeteoApi';
import { WeatherData } from '@/assets/types/WeatherData';
import { CARD_HEIGHT, CARD_WIDTH } from '@/constants/Layout';
import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';

interface WeatherCardProps {
  local: string; // Thêm prop để truyền địa điểm
}

export default function WeatherCard({ local }: WeatherCardProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    getFullCurrentWeatherByCity(local)
      .then((weather) => {
        if (isMounted && weather) {
          setWeatherData(new WeatherData(weather, {}));
        } else {
          setError('Không lấy được dữ liệu thời tiết');
        }
      })
      .catch((e) => {
        if (isMounted) setError(e.message);
      })
      .finally(() => isMounted && setLoading(false));
    return () => { isMounted = false; };
  }, [local]);

  if (loading) {
    return (
      <View >
        <Text></Text>
      </View>
    );
  }
  if (error || !weatherData) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>Lỗi: {error || 'Không có dữ liệu'}</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../assets/images/Rectangle_1.svg')}
      style={styles.card}
      imageStyle={styles.cardImage}
    >
      <Text style={styles.temperature}>{weatherData.getTemperature()}°</Text>
      <View style={styles.infoRow}>
        <Text style={styles.highLow}>
          {weatherData.getUVIndex() !== 0 ? `UV: ${weatherData.getUVIndex()}` : ''}
        </Text>
        <Text style={styles.highLow}>P: {weatherData.getPressure()}hPa | W: {weatherData.getWindSpeed()}m/s</Text>
        <Text
          style={styles.city}
          numberOfLines={2} // Cho phép xuống tối đa 2 dòng
          adjustsFontSizeToFit
          minimumFontScale={0.7}
        >
          {weatherData.getCity()}
        </Text>
      </View>
      <Text style={styles.condition}>{weatherData.getCondition()}</Text>
      <Image
        source={weatherData.getCustomIcon()}
        style={styles.weatherIcon}
        resizeMode="contain"
      />
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    margin: 16,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    padding: Math.max(16, Math.round(CARD_WIDTH * 0.06)),
    margin: 10,
    overflow: 'hidden',
    justifyContent: 'flex-start',
  },
  cardImage: {
    borderRadius: 24,
  },
  temperature: {
    color: 'white',
    fontSize: Math.max(48, Math.round(CARD_WIDTH * 0.18)),
    fontWeight: 'bold',
    position: 'absolute',
    left: Math.round(CARD_WIDTH * 0.06),
    bottom: Math.round(CARD_HEIGHT * 0.49),
  },
  infoRow: {
    position: 'absolute',
    left: Math.round(CARD_WIDTH * 0.07),
    bottom: Math.round(CARD_HEIGHT * 0.1),
    flexDirection: 'column', // Sắp xếp thông tin và thành phố theo cột
    maxWidth: Math.round(CARD_WIDTH * 0.55),
  },
  highLow: {
    color: 'rgba(235, 235, 245, 0.6)',
    fontSize: Math.max(12, Math.round(CARD_WIDTH * 0.038)),
    marginBottom: 2,
  },
  city: {
    color: 'white',
    fontSize: Math.max(15, Math.round(CARD_WIDTH * 0.05)),
    fontWeight: '500',
  },
  condition: {
    position: 'absolute',
    right: Math.round(CARD_WIDTH * 0.07),
    bottom: Math.round(CARD_HEIGHT * 0.1),
    color: 'white',
    fontSize: Math.max(13, Math.round(CARD_WIDTH * 0.044)),
  },
  weatherIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: Math.round(CARD_WIDTH * 0.47),
    height: Math.round(CARD_WIDTH * 0.47),
  },
});