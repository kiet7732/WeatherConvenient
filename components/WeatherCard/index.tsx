import React from 'react'
import { Text, View } from 'react-native'
import WeatherCard from './WeatherCard';

const IntemWeatherCard = () => {
    const local = ['Sahara', 'Phoenix', 'Cuzco', 'Phoenix', 'Cuzco'];
    return (
        <View>
            {local.map((location, index) => (
                <WeatherCard key={index} local={location} />
            ))}
        </View>
    )
}

export default IntemWeatherCard