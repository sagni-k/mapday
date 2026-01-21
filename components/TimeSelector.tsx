// /components

// TimeSelector.tsx



import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function TimeSelector({handle_Time_state} :{handle_Time_state:(time:number) => void} ){
    const[time,setTime]=useState<Date>(new Date());
    const[showPicker,setShowPicker] = useState(false);
    
    useEffect(() => {
        handle_Time_state(minutesSinceMidnight(time));
    }, []);
    
    return(
        <View style={styles.container}>
            <Pressable
                style={styles.timeButton}
                onPress={() => {setShowPicker(true);}}>
                <Text style={styles.timeText}>
                    {minutesSinceMidnightToTime(minutesSinceMidnight(time))}
                </Text>
            </Pressable>

            {showPicker && (
                <DateTimePicker
                    value={time}
                    mode="time"
                    display="spinner"
                    onChange={(event, selectedDate) => {
                        setShowPicker(false);

                        if (event.type === 'set' && selectedDate) {
                            setTime(selectedDate);
                            handle_Time_state(minutesSinceMidnight(selectedDate));
                        }
                    }}
                />
            )}
        </View>
    )
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
        width: '100%',
    },
    timeButton: {
        backgroundColor: '#F5F5F7',
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E5EA',
    },
    timeText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C1C1E',
    },
});
