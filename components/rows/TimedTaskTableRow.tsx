import { TimedTask } from "@/types/task";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { TimeSelector } from "../TimeSelector";

export function TimedTaskTableRow({
  item,
  handle_update_TimedTask,
  handle_delete_TimedTask,
}: {
  item: TimedTask;
  handle_update_TimedTask:(oldItemId:number,
        newItem:Omit<TimedTask, 'id'>) => Promise<void>;
  handle_delete_TimedTask: (id:number) => Promise<void>;
}){
    const [isEditing,setEditing] = useState<boolean>(false);
    const [taskName, setTaskName] = useState(item.taskName);
    const [startMinutes, setStartMinutes] = useState<number>(item.startMinutes);
    const [endMinutes, setEndMinutes] = useState<number>(item.endMinutes);

    function handle_startTime_state(startMinutes:number){
        setStartMinutes(startMinutes);
    }
    function handle_endTime_state(endMinutes:number){
        setEndMinutes(endMinutes);
    }

    return(
        <View style={styles.container}>
          {!isEditing ? (
            <View style={styles.taskCard}>
              <View style={styles.taskHeader}>
                <Text style={styles.taskName}>{item.taskName}</Text>
                <View style={styles.priorityBadge}>
                  <Text style={styles.priorityText}>Scheduled</Text>
                </View>
              </View>

              <View style={styles.timeContainer}>
                <View style={styles.timeItem}>
                  <Text style={styles.timeLabel}>Start</Text>
                  <Text style={styles.timeValue}>{minutesSinceMidnightToTime(item.startMinutes)}</Text>
                </View>
                <View style={styles.timeDivider} />
                <View style={styles.timeItem}>
                  <Text style={styles.timeLabel}>End</Text>
                  <Text style={styles.timeValue}>{minutesSinceMidnightToTime(item.endMinutes)}</Text>
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
                  onPress={() => handle_delete_TimedTask(item.id)}>
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

              <View style={styles.editActions}>
                <Pressable
                  style={styles.confirmButton}
                  onPress={async () => {
                    if (startMinutes === null || endMinutes === null) {
                        alert("Please select start and end time");
                        return;
                    }

                    if (endMinutes <= startMinutes) {
                        alert("End time must be after start time");
                        return;
                    }

                    await handle_update_TimedTask(item.id,{taskName,startMinutes,endMinutes});
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
    priorityBadge: {
        backgroundColor: '#E8F5E7',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    priorityText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#2D5F2E',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F7',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
    },
    timeItem: {
        flex: 1,
    },
    timeLabel: {
        fontSize: 12,
        color: '#8E8E93',
        marginBottom: 4,
        fontWeight: '500',
    },
    timeValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1C1C1E',
    },
    timeDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#E5E5EA',
        marginHorizontal: 12,
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    editButton: {
        flex: 1,
        backgroundColor: '#A8D5A5',
        borderRadius: 10,
        padding: 12,
        alignItems: 'center',
    },
    editButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#2D5F2E',
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
    timeRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    timeGroup: {
        flex: 1,
    },
    editActions: {
        gap: 10,
    },
    confirmButton: {
        backgroundColor: '#A8D5A5',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2D5F2E',
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