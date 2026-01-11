import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";


export function TimeSelector({handle_Time_state} :{handle_Time_state:(time:number) => void} ){
    const[time,setTime]=useState<Date>(new Date());
    const[showPicker,setShowPicker] = useState(false);
    useEffect(() => {
    handle_Time_state(minutesSinceMidnight(time));
  }, []);
    return(
        
        <View>
            <Pressable
                onPress={() => {setShowPicker(true);}}>
                <Text>{minutesSinceMidnightToTime(minutesSinceMidnight(time))}</Text>
            </Pressable>

            {showPicker===true?
            (<DateTimePicker
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
        />):
        (<Text>Press picker to select time</Text>)}

    </View>
        


    )
}

function minutesSinceMidnight(selectedDate: Date): number {
  return selectedDate.getHours() * 60 + selectedDate.getMinutes();
}

function minutesSinceMidnightToTime(minutes: number): string {
  const totalMinutes = minutes % 1440; // just in case life happens

  let hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  const period = hours >= 12 ? "pm" : "am";

  hours = hours % 12;
  if (hours === 0) hours = 12;

  const paddedMinutes = mins.toString().padStart(2, "0");

  return `${hours}:${paddedMinutes} ${period}`;
}
