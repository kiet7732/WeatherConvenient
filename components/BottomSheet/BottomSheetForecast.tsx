import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'; // Thêm BottomSheetView
import React, { ReactNode, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const TAB_LIST = [
    { key: 'hourly', label: 'Hourly Forecast' },
    { key: 'weekly', label: 'Weekly Forecast' },
];

interface BottomSheetForecastProps {
    hourlyContent?: ReactNode;
    weeklyContent?: ReactNode;
}

export default function BottomSheetCustom({
    hourlyContent,
    weeklyContent,
}: BottomSheetForecastProps) {
    const [activeTab, setActiveTab] = useState('hourly');
    const bottomSheetRef = useRef<BottomSheet>(null);

    // Snap points: Chỉ 45% và 90%
    const snapPoints = useMemo(() => ['45%', '90%'], []);

    return (
        <GestureHandlerRootView style={styles.container}>
            <BottomSheet
                ref={bottomSheetRef}
                index={0} // Bắt đầu ở 45%
                snapPoints={snapPoints}
                enablePanDownToClose={false} // Ngăn đóng hoàn toàn
                backgroundStyle={styles.sheetContainer}
                handleIndicatorStyle={styles.handleIndicator}
                overDragResistanceFactor={0} // Ngăn kéo quá mức
                enableOverDrag={false} // Tắt hoàn toàn kéo quá mức
                enableDynamicSizing={false} // Chỉ sử dụng snapPoints đã định nghĩa
            >
                <BottomSheetView style={styles.contentContainer}>
                    {/* Tab Bar */}
                    <View style={styles.tabBar}>
                        {TAB_LIST.map(tab => (
                            <TouchableOpacity
                                key={tab.key}
                                style={styles.tab}
                                onPress={() => setActiveTab(tab.key)}
                            >
                                <Text
                                    style={[
                                        styles.tabText,
                                        activeTab === tab.key && styles.tabTextActive,
                                    ]}
                                >
                                    {tab.label}
                                </Text>
                                {activeTab === tab.key && <View style={styles.tabIndicator} />}
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        {activeTab === 'hourly'
                            ? (hourlyContent ?? <Text style={styles.placeholder}>Hourly Forecast Content</Text>)
                            : (weeklyContent ?? <Text style={styles.placeholder}>Weekly Forecast Content</Text>)
                        }
                    </View>
                </BottomSheetView>
            </BottomSheet>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    sheetContainer: {
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        borderRadius: 0,
        backgroundColor: '#3B2667',
    },
    handleIndicator: {
        backgroundColor: '#6C4BC9',
        width: 60,
        height: 5,
        alignSelf: 'center',
        marginVertical: 5,
    },
    contentContainer: {
        flex: 1,
        paddingTop: 15,
    },
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 32,
        paddingTop: 8,
        backgroundColor: 'transparent',
    },
    tab: {
        alignItems: 'center',
        flex: 1,
        paddingTop: 0,
    },
    tabText: {
        color: '#C7BFFF',
        fontSize: 16,
        fontWeight: '500',
        paddingBottom: 8,
    },
    tabTextActive: {
        color: '#fff',
        fontWeight: '700',
    },
    tabIndicator: {
        height: 2,
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 1,
        alignSelf: 'center',
        marginTop: -2,
    },
    content: {
        paddingTop: 10,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    placeholder: {
        color: '#C7BFFF',
        fontSize: 18,
    },
});

