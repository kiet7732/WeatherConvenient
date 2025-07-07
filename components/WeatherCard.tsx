import { getCurrentUVCoords } from '@/api/currentUV';
import { getCurrentWeatherByCity } from '@/api/weatherApi';
import { WeatherData } from '@/assets/types/WeatherData';
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
    getCurrentWeatherByCity(local, 'metric')
      .then(async (weather) => {
        const lat = weather.coord.lat;
        const lon = weather.coord.lon;
        try {
          const oneCall = await getCurrentUVCoords(lat, lon, 'metric');
          if (isMounted && oneCall) {
            setWeatherData(new WeatherData(weather, oneCall));
          } else {
            setError('Không lấy được dữ liệu chỉ số UV');
          }
        } catch (e: any) {
          console.error('One Call Error Details:', e.message);
          if (isMounted) setError(`Lỗi One Call: ${e.message}`);
        }
      })
      .catch((e) => {
        console.error('Weather API Error:', e.message);
        if (isMounted) setError(e.message);
      })
      .finally(() => isMounted && setLoading(false));
    return () => { isMounted = false; };
  }, [local]); // Re-run khi local thay đổi  

  // Debug: log the condition string
  console.log('WeatherCard getCondition:', weatherData?.getCustomIcon());

  if (loading) {
    return (
      <View >
        {/* <ActivityIndicator size="large" color="#6C3EF5" /> */}
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
        <Text style={styles.highLow}>UV: {weatherData.getUVIndex()}</Text>
        <Text style={styles.highLow}>P: {weatherData.getPressure()}hPa | W: {weatherData.getWindSpeed()}m/s</Text>
        <Text style={styles.city}>{weatherData.getCity()}</Text>
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
    width: 342,
    height: 184,
    borderRadius: 24,
    margin: 16,
  },
  card: {
    width: 342,
    height: 184,
    borderRadius: 24,
    padding: 20,
    margin: 16,
    overflow: 'hidden',
    justifyContent: 'flex-start',
  },
  cardImage: {
    borderRadius: 24,
  },
  temperature: {
    color: 'white',
    fontSize: 64,
    fontWeight: 'bold',
    position: 'absolute',
    left: 22,
    bottom: 79,
  },
  infoRow: {
    position: 'absolute',
    left: 24,
    bottom: 18,
  },
  highLow: {
    color: 'rgba(235, 235, 245, 0.6)',
    fontSize: 13,
    marginBottom: 2,
  },
  city: {
    color: 'white',
    fontSize: 17,
    fontWeight: '500',
  },
  condition: {
    position: 'absolute',
    right: 24,
    bottom: 18,
    color: 'white',
    fontSize: 15,
  },
  weatherIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 160,
    height: 160,
  },
});