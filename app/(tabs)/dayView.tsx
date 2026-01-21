// app/(tabs)/dayView.tsx

import TaskDayView from '@/components/TaskDayView';
import { connect_db } from '@/db/database';
import { read_TimedTasks_from_db } from '@/db/timedtasks';
import { TimedTask } from '@/types/task';
import { useEffect, useState } from 'react';
import { Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DayView(){
    const[allTimedTasks,onChangeTimedTasks]=useState<TimedTask[]>([]);
    const [loading,setLoading]=useState(true);
    const [refreshing,setRefreshing]=useState(false);

    async function handle_read_tasks(){
        const allTimedTasks = await read_TimedTasks_from_db();
        onChangeTimedTasks(allTimedTasks);
    }

    async function handleRefresh(){
        setRefreshing(true);
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

    return(
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" />
            
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.headerTitle}>Day Schedule</Text>
                        <Text style={styles.headerSubtitle}>Your tasks timeline</Text>
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
            </View>

            <View style={styles.content}>
                <TaskDayView allTimedTasks={allTimedTasks} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F7',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 24,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    content: {
        flex: 1,
        marginHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
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