import { TimedTask } from "@/types/task";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
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
        <View>
          
          <View>
            <Text>{item.taskName}</Text>
            <Text>{minutesSinceMidnightToTime(item.startMinutes)}</Text>
            <Text>{minutesSinceMidnightToTime(item.endMinutes)}</Text>

            <View>
              <Button title="Modify" onPress={() => setEditing(true)} />
              <Button title="Delete" onPress={() => handle_delete_TimedTask(item.id)} />
            </View>
          </View>

          
          {isEditing && (
            <View>
              <TextInput value={taskName} onChangeText={setTaskName} />
              <TimeSelector handle_Time_state = {handle_startTime_state}/>
              <TimeSelector handle_Time_state = {handle_endTime_state}/>

              <View>
                <Button
                  title="Confirm"
                  onPress={async () => {
                    if (startMinutes === null || endMinutes === null) {
                        alert("Please select start and end time");
                        return;
                    }

                    if (endMinutes>=startMinutes) {
                        alert("Please select start and end time");
                        return;
                    }

                    await handle_update_TimedTask(item.id,{taskName,startMinutes,endMinutes});
                    setEditing(false);
                  }}
                />
                <Button
                  title="Cancel"
                  onPress={() => {
                    setEditing(false);
                  }}
                />
              </View>
            </View>
          )}
        </View>
    );
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