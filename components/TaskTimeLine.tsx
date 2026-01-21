// /components/TaskTimeLine.tsx

import { TimedTask } from "@/types/task";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import ExpandedDetails from "./ExpandedDetails";
import TaskCard from "./TaskCard";

export default function TaskTimeLine(
    {allTimedTasks,nowMinutes}:{allTimedTasks:TimedTask[],nowMinutes:number} 
){
    const [expandedid,setExpandedid] = useState<number | null>(null);
    const visibleTasks = filterAllTimedTasks(allTimedTasks);

    function renderSortedItems(item : TimedTask ){
        const isExpanded = (item.id===expandedid);

        return (
            <View style={styles.taskItemContainer}>
                {isExpanded && <ExpandedDetails task={item} /> }
                <Pressable
                    onPress={() => {
                        setExpandedid(prev => (prev===item.id?null:item.id))
                    }}
                >
                    <TaskCard task={item}/> 
                </Pressable>
            </View>
        );
    }

    function filterAllTimedTasks(allTimedTasks: TimedTask[]) {
        return allTimedTasks.filter(task =>
            task.startMinutes <= nowMinutes &&
            task.endMinutes > nowMinutes
        );
    }

    useEffect(() => {
        setExpandedid(null);
    }, [nowMinutes]);

    return(
        <View style={styles.container}>
            {visibleTasks.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateIcon}>📋</Text>
                    <Text style={styles.emptyStateText}>No Active Tasks</Text>
                    <Text style={styles.emptyStateSubtext}>
                        No tasks are scheduled for right now
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={visibleTasks}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item}) => renderSortedItems(item)}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    taskItemContainer: {
        marginBottom: 12,
    },
    listContent: {
        paddingBottom: 20,
    },
    emptyState: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 40,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    emptyStateIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1C1C1E',
        marginBottom: 8,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#8E8E93',
        textAlign: 'center',
    },
});