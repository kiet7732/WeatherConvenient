import { getCurrentUVCoords } from '@/api/currentUV';
import { getCurrentWeatherByCity } from '@/api/weatherApi';
import { WeatherData } from '@/assets/types/WeatherData';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getCurrentWeatherByCity('Ho Chi Minh', 'metric')
      .then(async (weather) => {
        const lat = weather.coord.lat;
        const lon = weather.coord.lon;
        try {
          const oneCall = await getCurrentUVCoords(lat, lon, 'metric');
          if (isMounted && oneCall) {
            setWeatherData(new WeatherData(weather, oneCall));
          } else {
            setError('Không lấy được dữ liệu chỉ số UV (One Call API)');
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
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C3EF5" />
        <Text>Đang tải dữ liệu thời tiết...</Text>
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
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }} contentContainerStyle={{ alignItems: 'center', paddingVertical: 24 }}>                
      <View style={styles.infoBox}>
        <Text style={styles.label}>Cảm giác như: <Text style={styles.value}>{weatherData.getFeelsLike()}°</Text></Text>
        <Text style={styles.label}>Áp suất: <Text style={styles.value}>{weatherData.getPressure()} hPa</Text></Text>
        <Text style={styles.label}>Độ ẩm: <Text style={styles.value}>{weatherData.getHumidity()}%</Text></Text>
        <Text style={styles.label}>Điểm sương: <Text style={styles.value}>{weatherData.getDewPoint()}°</Text></Text>
        <Text style={styles.label}>Tốc độ gió: <Text style={styles.value}>{weatherData.getWindSpeed()} m/s</Text></Text>
        <Text style={styles.label}>Hướng gió: <Text style={styles.value}>{weatherData.getWindDirection()}°</Text></Text>
        <Text style={styles.label}>Độ che phủ mây: <Text style={styles.value}>{weatherData.getCloudiness()}%</Text></Text>
        <Text style={styles.label}>Tầm nhìn: <Text style={styles.value}>{weatherData.getVisibility()} km</Text></Text>
        <Text style={styles.label}>Chỉ số UV: <Text style={styles.value}>{weatherData.getUVIndex()}</Text></Text>
        <Text style={styles.label}>Lượng mưa: <Text style={styles.value}>{weatherData.getRainfall()} mm</Text></Text>
        <Text style={styles.label}>Lượng tuyết: <Text style={styles.value}>{weatherData.getSnowfall()} mm</Text></Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  infoBox: {
    marginTop: 16,
    backgroundColor: '#f3f3fa',
    borderRadius: 16,
    padding: 16,
    width: 340,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  value: {
    fontWeight: 'bold',
    color: '#6C3EF5',
  },
});