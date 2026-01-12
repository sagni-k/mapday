import { useEffect, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";

import { connect_db } from '@/db/database';
import { create_TimedTask_row_in_db, delete_TimedTask_row_in_db, read_TimedTasks_from_db, update_TimedTask_row_in_db } from '@/db/timedtasks';
import { create_UnTimedTask_row_in_db, delete_UnTimedTask_row_in_db, read_UnTimedTasks_from_db, update_UnTimedTask_row_in_db } from '@/db/untimedtasks';
import { TimedTask, UnTimedTask } from '@/types/task';

import { TimedTaskTable } from '@/components/tables/TimedTaskTable';
import { UnTimedTaskTable } from '@/components/tables/UnTimedTaskTable';

export default function Index(){
    const [loading, setLoading] = useState(true);
    const [allTimedTasks,onChangeTimedTasks] = useState<TimedTask[]>([]);
    const [allUnTimedTasks,onChangeUnTimedTasks] = useState<UnTimedTask[]>([]);

    async function handle_read_tasks() {
        const allTimedTasks = await read_TimedTasks_from_db();
        const allUnTimedTasks = await read_UnTimedTasks_from_db();
        onChangeTimedTasks(allTimedTasks);
        onChangeUnTimedTasks(allUnTimedTasks);
    }

    async function handle_create_TimedTask(item: Omit<TimedTask, 'id'>){
        await create_TimedTask_row_in_db(item);
        await handle_read_tasks();
    }

    async function handle_create_UnTimedTask(item: Omit<UnTimedTask, 'id'>){
        await create_UnTimedTask_row_in_db(item);
        await handle_read_tasks();
    }

    async function handle_update_TimedTask(
        oldItemId:number,
        newItem:Omit<TimedTask, 'id'>) {
        await update_TimedTask_row_in_db(oldItemId,newItem);
        await handle_read_tasks();
    }

    async function handle_update_UnTimedTask(
        oldItemId:number,
        newItem:Omit<UnTimedTask, 'id'>) {
        await update_UnTimedTask_row_in_db(oldItemId,newItem);
        await handle_read_tasks();
            
    }

    async function handle_delete_TimedTask(id:number){
        await delete_TimedTask_row_in_db(id);
        await handle_read_tasks();
    }

    async function handle_delete_UnTimedTask(id:number) {
        await delete_UnTimedTask_row_in_db(id);
        await handle_read_tasks();
    }

    useEffect(  () => { 
        (async() => {
        await connect_db();
        await handle_read_tasks();
        setLoading(false);})(); 
    },[])

    if(loading) return(
        <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading…</Text>
        </View>
    );

    return(
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}>
                
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>My Tasks</Text>
                    <Text style={styles.headerSubtitle}>Manage your daily schedule</Text>
                </View>

                <TimedTaskTable
                    allTimedTasks={allTimedTasks}
                    handle_create_TimedTask={handle_create_TimedTask}
                    handle_update_TimedTask={handle_update_TimedTask}
                    handle_delete_TimedTask={handle_delete_TimedTask}/>

                <UnTimedTaskTable
                    allUnTimedTasks={allUnTimedTasks}
                    handle_create_UnTimedTask={handle_create_UnTimedTask}
                    handle_update_UnTimedTask={handle_update_UnTimedTask}
                    handle_delete_UnTimedTask={handle_delete_UnTimedTask}/>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F7',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 24,
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