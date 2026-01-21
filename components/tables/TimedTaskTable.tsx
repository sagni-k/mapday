// /components/tables
// TimedTaskTable.tsx


import { TimedTask } from "@/types/task";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { TimeSelector } from "../TimeSelector";
import { TimedTaskTableRow } from "../rows/TimedTaskTableRow";

export function TimedTaskTable(
    {allTimedTasks,
    handle_create_TimedTask,
    handle_update_TimedTask,
    handle_delete_TimedTask,}: 
    { allTimedTasks: TimedTask[];
    handle_create_TimedTask: (item: Omit<TimedTask, 'id'>) => Promise<void>;
    handle_update_TimedTask: (oldItemId:number,
        newItem:Omit<TimedTask, 'id'>) => Promise<void>;
    handle_delete_TimedTask: (id:number) => Promise<void>;} )

    {

    const [taskName,settaskName] = useState<string>("");
    const [startMinutes,setstartMinutes] = useState<number | null>(null);
    const [endMinutes,setendMinutes] = useState<number | null>(null);

    function handle_startTime_state(startMinutes:number){
        setstartMinutes(startMinutes);
    }

    function handle_endTime_state(endMinutes:number){
        setendMinutes(endMinutes);
    }

    return(
        <View style={styles.container}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Scheduled Tasks</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{allTimedTasks.length}</Text>
                </View>
            </View>

            {allTimedTasks.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>No scheduled tasks yet</Text>
                    <Text style={styles.emptyStateSubtext}>Create your first timed task below</Text>
                </View>
            ) : (
                <FlatList
                    scrollEnabled={false}
                    data={allTimedTasks}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) =>
                        renderItemsTimed({
                        item,
                        handle_update_TimedTask,
                        handle_delete_TimedTask,
                        })
                    }
                    contentContainerStyle={styles.listContent}
                />
            )} 
        
            <View style={styles.createCard}>
                <Text style={styles.createCardTitle}>Create New Task</Text>
                
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Task Name</Text>
                    <TextInput
                        style={styles.input}
                        value={taskName} 
                        onChangeText={settaskName}
                        placeholder="Enter task name"
                        placeholderTextColor="#C7C7CC" />
                </View>

                <View style={styles.timeRow}>
                    <View style={styles.timeGroup}>
                        <Text style={styles.inputLabel}>Start Time</Text>
                        <TimeSelector handle_Time_state={handle_startTime_state}/>
                    </View>
                    
                    <View style={styles.timeGroup}>
                        <Text style={styles.inputLabel}>End Time</Text>
                        <TimeSelector handle_Time_state={handle_endTime_state}/>
                    </View>
                </View>

                <Pressable
                    style={styles.createButton}
                    onPress={() => {
                        if(taskName===""){
                            alert("Task name can't be empty");
                            return;
                        }

                        if(startMinutes === null || endMinutes === null){
                            alert("startTime and endTime can't be empty")
                            return;
                        }

                        if (endMinutes <= startMinutes) {
                            alert("startTime should be earlier than endTime");
                            return;
                        }
                        
                        handle_create_TimedTask({taskName,startMinutes,endMinutes});
                        settaskName("");
                    }}>
                    <Text style={styles.createButtonText}>+ Add Task</Text>
                </Pressable>
            </View>
        </View>
    );
    
}

function renderItemsTimed({
  item,
  handle_update_TimedTask,
  handle_delete_TimedTask,
}: {
  item: TimedTask;
  handle_update_TimedTask: 
    (oldItemId:number,
        newItem:Omit<TimedTask, 'id'>) => Promise<void>;
  handle_delete_TimedTask: (id:number) => Promise<void>;
}){
    return (
        <TimedTaskTableRow  
            item={item} 
            handle_delete_TimedTask={handle_delete_TimedTask}
            handle_update_TimedTask={handle_update_TimedTask}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1C1C1E',
        marginRight: 8,
    },
    badge: {
        backgroundColor: '#A8D5A5',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2D5F2E',
    },
    emptyState: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 32,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    emptyStateText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C1C1E',
        marginBottom: 4,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#8E8E93',
    },
    listContent: {
        gap: 12,
    },
    createCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginTop: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    createCardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1C1C1E',
        marginBottom: 16,
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1C1C1E',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F5F5F7',
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        color: '#1C1C1E',
        borderWidth: 1,
        borderColor: '#E5E5EA',
    },
    timeRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    timeGroup: {
        flex: 1,
    },
    createButton: {
        backgroundColor: '#A8D5A5',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#2D5F2E',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    createButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2D5F2E',
    },
});