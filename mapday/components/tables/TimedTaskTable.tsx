import { TimedTask } from "@/types/task";
import { useState } from "react";
import { Button, FlatList, Text, TextInput, View } from 'react-native';
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

    const [taskName,settaskName] = useState<string>("taskName");
    const [startMinutes,setstartMinutes] = useState<number | null>(null);
    const [endMinutes,setendMinutes] = useState<number | null>(null);

    function handle_startTime_state(startMinutes:number){
        setstartMinutes(startMinutes);
    }

    function handle_endTime_state(endMinutes:number){
        setendMinutes(endMinutes);
    }

    return(
        
    <View>
        
        <View>
        <Text>Task Name</Text>
        <Text>Start Time</Text>
        <Text>End Time</Text>
        <Text>Actions</Text>
      </View>


        {allTimedTasks.length===0?
            (<View><Text>No Timed Tasks Inserted</Text></View>) :
            (<FlatList
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
            />)} 
        
        <View>
            <TextInput
                value={taskName} onChangeText={settaskName} />
            
            <TimeSelector handle_Time_state = {handle_startTime_state}/>
            <TimeSelector handle_Time_state = {handle_endTime_state}/>

        </View>
        <Button
            title='create new row'
            onPress={() => {
                if(startMinutes === null || endMinutes === null){
                    alert("startTime and endTime can't be empty")
                    return;
                }

                if (endMinutes <= startMinutes) {
                    alert("startTime should be earlier than endTime");
                    return;
                }

                                
                               
                handle_create_TimedTask({taskName,startMinutes,endMinutes});
                                
            }}
        />

            

    </View>);
    
}function renderItemsTimed({
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
        <TimedTaskTableRow  item={item} 
                            handle_delete_TimedTask={handle_delete_TimedTask}
                            handle_update_TimedTask={handle_update_TimedTask}
        />
  
    );
}