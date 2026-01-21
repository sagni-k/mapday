

// /components/tables
// UnTimedTaskTable.tsx

import { UnTimedTask } from "@/types/task";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { UnTimedTaskTableRow } from "../rows/UnTimedTaskTableRow";

export function UnTimedTaskTable({
  allUnTimedTasks,
  handle_create_UnTimedTask,
  handle_update_UnTimedTask,
  handle_delete_UnTimedTask,
}: {
  allUnTimedTasks: UnTimedTask[];
  handle_create_UnTimedTask: (item: Omit<UnTimedTask, 'id'>) => Promise<void>;
  handle_update_UnTimedTask: (
    oldItemId:number,
    newItem:Omit<UnTimedTask, 'id'>
  ) => Promise<void>;
  handle_delete_UnTimedTask: (id:number) => Promise<void>;
}){
    const [taskName,settaskName] = useState<string>("");
    
    return(
        <View style={styles.container}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Flexible Tasks</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{allUnTimedTasks.length}</Text>
                </View>
            </View>

            {allUnTimedTasks.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>No flexible tasks yet</Text>
                    <Text style={styles.emptyStateSubtext}>Create tasks without specific times</Text>
                </View>
            ) : (
                <FlatList
                    scrollEnabled={false}
                    data={allUnTimedTasks}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) =>
                        renderItemsUnTimed({
                            item,
                            handle_update_UnTimedTask,
                            handle_delete_UnTimedTask,
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
                        onChangeText={settaskName}
                        value={taskName}
                        placeholder="Enter task name"
                        placeholderTextColor="#C7C7CC" />
                </View>

                <Pressable
                    style={styles.createButton}
                    onPress={() => {
                        handle_create_UnTimedTask({taskName});
                        settaskName("");
                    }}>
                    <Text style={styles.createButtonText}>+ Add Task</Text>
                </Pressable>
            </View>
        </View>
    )    
}

function renderItemsUnTimed({ item, handle_update_UnTimedTask, handle_delete_UnTimedTask }: any){
  return (
    <UnTimedTaskTableRow
      item={item}
      handle_update_UnTimedTask={handle_update_UnTimedTask}
      handle_delete_UnTimedTask={handle_delete_UnTimedTask}
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
        backgroundColor: '#B8B5E3',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4A4268',
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
    createButton: {
        backgroundColor: '#B8B5E3',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#4A4268',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    createButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4A4268',
    },
});