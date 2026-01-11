import { UnTimedTask } from "@/types/task";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";



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
    <View>
      <View>
        <Text>{item.taskName}</Text>

        <View>
          <Button title="Modify" onPress={() => setEditing(true)} />
          <Button title="Delete" onPress={() => handle_delete_UnTimedTask(item.id)} />
        </View>
      </View>

      {isEditing && (
        <View>
          <TextInput
            
            value={taskName}
            onChangeText={setTaskName}
          />

          <View>
            <Button
              title="Confirm"
              onPress={async () => {
                await handle_update_UnTimedTask(item.id,{ taskName });
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