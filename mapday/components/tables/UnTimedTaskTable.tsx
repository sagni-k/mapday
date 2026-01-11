import { UnTimedTask } from "@/types/task";
import { useState } from "react";
import { Button, FlatList, Text, TextInput, View } from "react-native";
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
    const [taskName,settaskName] = useState<string>("taskName");
    
    return(
        <View>

            <View>
                <Text>Task Name</Text>
                <Text>Actions</Text>
            </View>
            {allUnTimedTasks.length===0?(<View><Text>No UnTimed Tasks Inserted</Text></View>)
            :(<FlatList
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
            />)} 
            

            <View>
                <TextInput
                    onChangeText={settaskName}
                    value={taskName}/>
                    
                
            </View>
            <Button
                title='create new row'
                onPress={() => {handle_create_UnTimedTask({taskName});}} />
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