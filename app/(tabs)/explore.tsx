import WeatherCard from '@/components/WeatherCard';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function ExploreScreen() {
  const local = ['Sahara', 'Phoenix', 'Cuzco', 'Phoenix', 'Cuzco'];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }} contentContainerStyle={{ alignItems: 'center', paddingVertical: 24 }}>
      {local.map((location, index) => (
        <WeatherCard key={index} local={location} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Không cần style center nữa vì đã di chuyển vào WeatherCard
});