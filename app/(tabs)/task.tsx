// app/(tabs)/task.tsx

import TaskTimeLine from '@/components/TaskTimeLine';
import { connect_db } from '@/db/database';
import { read_TimedTasks_from_db } from '@/db/timedtasks';
import { TimedTask } from '@/types/task';
import { useEffect, useState } from 'react';
import { Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Task() {
    const[allTimedTasks,onChangeTimedTasks]=useState<TimedTask[]>([]);
    const [loading,setLoading]=useState(true);
    const [refreshing,setRefreshing]=useState(false);
    const [nowMinutes,setnowMinutes] = useState<number>(minutesSinceMidnight(new Date()));
    
    async function handle_read_tasks(){
        const allTimedTasks = await read_TimedTasks_from_db();
        onChangeTimedTasks(allTimedTasks);
    }

    async function handleRefresh(){
        setRefreshing(true);
        setnowMinutes(minutesSinceMidnight(new Date()));
        await handle_read_tasks();
        setRefreshing(false);
    }

    useEffect( () =>{
        (async ()=>{
            await connect_db();
            await handle_read_tasks();
            setLoading(false);
        })();
    },[])

    if(loading) return (
        <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading…</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" />
            
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.headerTitle}>Current Tasks</Text>
                        <Text style={styles.headerSubtitle}>Active right now</Text>
                    </View>
                    
                    <Pressable 
                        style={styles.refreshButton}
                        onPress={handleRefresh}
                        disabled={refreshing}
                    >
                        <Text style={styles.refreshButtonText}>
                            {refreshing ? '↻' : '⟳'}
                        </Text>
                    </Pressable>
                </View>

                <View style={styles.timeCard}>
                    <Text style={styles.timeLabel}>Current Time</Text>
                    <Text style={styles.timeValue}>
                        {minutesSinceMidnightToTime(nowMinutes)}
                    </Text>
                </View>
            </View>

            <View style={styles.content}>
                <TaskTimeLine 
                    allTimedTasks={allTimedTasks}
                    nowMinutes={nowMinutes}
                />
            </View>
        </SafeAreaView>
    );
}

function minutesSinceMidnight(selectedDate: Date): number {
    return selectedDate.getHours() * 60 + selectedDate.getMinutes();
}

function minutesSinceMidnightToTime(minutes: number): string {
    const totalMinutes = minutes % 1440;
    let hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const period = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    if (hours === 0) hours = 12;
    const paddedMinutes = mins.toString().padStart(2, "0");
    return `${hours}:${paddedMinutes} ${period}`;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F7',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1C1C1E',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#8E8E93',
        fontWeight: '400',
    },
    refreshButton: {
        backgroundColor: '#A8D5A5',
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#2D5F2E',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    refreshButtonText: {
        fontSize: 24,
        color: '#2D5F2E',
        fontWeight: '700',
    },
    timeCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    timeLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8E8E93',
        marginBottom: 4,
    },
    timeValue: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1C1C1E',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F7',
    },
    loadingText: {
        fontSize: 18,
        color: '#8E8E93',
        fontWeight: '500',
    },
});