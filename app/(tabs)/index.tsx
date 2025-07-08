import { getCoordsByCity, getSevenDayForecastByCoords } from '@/api/openMeteoApi';
import { SevenDayForecastData } from '@/assets/types/SevenDayForecastData';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

async function getUVIndexForDay(lat: number, lon: number, date: Date): Promise<number | null> {
  // currentUV chỉ trả về UV hiện tại, không có UV từng ngày, nên chỉ lấy UV cho ngày hiện tại
  try {
    const { getCurrentUVCoords } = await import('@/api/currentUV');
    const uv = await getCurrentUVCoords(lat, lon, 'metric');
    return typeof uv.uvi === 'number' ? uv.uvi : null;
  } catch {
    return null;
  }
}

export default function HomeScreen() {
  const [city] = useState('Ho Chi Minh'); // Có thể thay đổi thành input nếu muốn
  const [forecastData, setForecastData] = useState<SevenDayForecastData | null>(null);
  const [uvIndex, setUvIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setUvIndex(null);
    let lat = 0, lon = 0;
    getCoordsByCity(city)
      .then((coords) => {
        lat = coords.lat;
        lon = coords.lon;
        return getSevenDayForecastByCoords(lat, lon);
      })
      .then((forecast) => {
        if (isMounted) setForecastData(new SevenDayForecastData(forecast));
        // Lấy UV cho ngày hiện tại (currentUV không hỗ trợ 7 ngày)
        return getUVIndexForDay(lat, lon, new Date());
      })
      .then((uv) => {
        if (isMounted) setUvIndex(uv);
      })
      .catch((e) => {
        if (isMounted) setError(e.message);
      })
      .finally(() => isMounted && setLoading(false));
    return () => { isMounted = false; };
  }, [city]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C3EF5" />
        <Text>Đang tải dự báo 7 ngày...</Text>
      </View>
    );
  }
  if (error || !forecastData) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>Lỗi: {error || 'Không có dữ liệu dự báo'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }} contentContainerStyle={{ alignItems: 'center', paddingVertical: 24 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Dự báo 7 ngày cho {city}</Text>
      {forecastData.getAllDays().map((day, idx) => (
        <View key={day.dt} style={styles.infoBox}>
          <Text style={styles.label}>
            Ngày: <Text style={styles.value}>{new Date(day.dt * 1000).toLocaleDateString('vi-VN')}</Text>
          </Text>
          <Text style={styles.label}>
            Nhiệt độ trung bình: <Text style={styles.value}>{day.temp.day.toFixed(1)}°C</Text>
          </Text>
          <Text style={styles.label}>
            Nhiệt độ thấp nhất: <Text style={styles.value}>{day.temp.min.toFixed(1)}°C</Text>
          </Text>
          <Text style={styles.label}>
            Nhiệt độ cao nhất: <Text style={styles.value}>{day.temp.max.toFixed(1)}°C</Text>
          </Text>
          <Text style={styles.label}>
            Nhiệt độ sáng: <Text style={styles.value}>{day.temp.morn.toFixed(1)}°C</Text>
          </Text>
          <Text style={styles.label}>
            Nhiệt độ chiều: <Text style={styles.value}>{day.temp.eve.toFixed(1)}°C</Text>
          </Text>
          <Text style={styles.label}>
            Nhiệt độ đêm: <Text style={styles.value}>{day.temp.night.toFixed(1)}°C</Text>
          </Text>
          <Text style={styles.label}>
            Thời tiết: <Text style={styles.value}>{day.weather[0]?.description}</Text>
          </Text>
          <Text style={styles.label}>
            Áp suất: <Text style={styles.value}>{day.pressure} hPa</Text>
          </Text>
          <Text style={styles.label}>
            Độ ẩm: <Text style={styles.value}>{day.humidity}%</Text>
          </Text>
          <Text style={styles.label}>
            Tốc độ gió: <Text style={styles.value}>{day.wind_speed} m/s</Text>
          </Text>
          <Text style={styles.label}>
            Hướng gió: <Text style={styles.value}>{day.wind_deg}°</Text>
          </Text>
          <Text style={styles.label}>
            Độ che phủ mây: <Text style={styles.value}>{day.clouds}%</Text>
          </Text>
          <Text style={styles.label}>
            Chỉ số UV: <Text style={styles.value}>{day.uvi}</Text>
          </Text>
          <Text style={styles.label}>
            Lượng mưa: <Text style={styles.value}>{day.rain ?? 0} mm</Text>
          </Text>
          <Text style={styles.label}>
            Lượng tuyết: <Text style={styles.value}>{day.snow ?? 0} mm</Text>
          </Text>
          {idx === 0 && (
            <Text style={styles.label}>
              UV (currentUV): <Text style={styles.value}>{uvIndex !== null ? uvIndex : 'Không có'}</Text>
            </Text>
          )}
        </View>
      ))}
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