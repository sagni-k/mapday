// /components/rows

// UnTimedTaskTableRow.tsx

import { UnTimedTask } from "@/types/task";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export function UnTimedTaskTableRow({
  item,
  handle_update_UnTimedTask,
  handle_delete_UnTimedTask,
}: {
  item: UnTimedTask;
  handle_update_UnTimedTask: (
    oldItemId:number,
    newItem:Omit<UnTimedTask, 'id'>
  ) => Promise<void>;
  handle_delete_UnTimedTask: (id:number)=>Promise<void>;
}) {
  const [isEditing, setEditing] = useState(false);
  const [taskName, setTaskName] = useState(item.taskName);

  return (
    <View style={styles.container}>
      {!isEditing ? (
        <View style={styles.taskCard}>
          <View style={styles.taskHeader}>
            <Text style={styles.taskName}>{item.taskName}</Text>
            <View style={styles.flexibleBadge}>
              <Text style={styles.flexibleText}>Flexible</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable 
              style={styles.editButton} 
              onPress={() => setEditing(true)}>
              <Text style={styles.editButtonText}>Edit</Text>
            </Pressable>
            <Pressable 
              style={styles.deleteButton} 
              onPress={() => handle_delete_UnTimedTask(item.id)}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.editCard}>
          <Text style={styles.editTitle}>Edit Task</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Task Name</Text>
            <TextInput
              style={styles.input}
              value={taskName}
              onChangeText={setTaskName}
              placeholder="Enter task name"
              placeholderTextColor="#C7C7CC"
            />
          </View>

          <View style={styles.editActions}>
            <Pressable
              style={styles.confirmButton}
              onPress={async () => {
                await handle_update_UnTimedTask(item.id,{ taskName });
                setEditing(false);
              }}>
              <Text style={styles.confirmButtonText}>Save Changes</Text>
            </Pressable>
            <Pressable
              style={styles.cancelButton}
              onPress={() => {
                setEditing(false);
              }}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
    },
    taskCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    taskHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    taskName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1C1C1E',
        flex: 1,
        marginRight: 12,
    },
    flexibleBadge: {
        backgroundColor: '#EFE9F7',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    flexibleText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4A4268',
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    editButton: {
        flex: 1,
        backgroundColor: '#B8B5E3',
        borderRadius: 10,
        padding: 12,
        alignItems: 'center',
    },
    editButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#4A4268',
    },
    deleteButton: {
        flex: 1,
        backgroundColor: '#FFE5E5',
        borderRadius: 10,
        padding: 12,
        alignItems: 'center',
    },
    deleteButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#D32F2F',
    },
    editCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    editTitle: {
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
    editActions: {
        gap: 10,
    },
    confirmButton: {
        backgroundColor: '#B8B5E3',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4A4268',
    },
    cancelButton: {
        backgroundColor: '#F5F5F7',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#8E8E93',
    },
});