import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";

let db: SQLite.SQLiteDatabase | null = null;

type TimedTask ={
    taskName: string;
    startTime: string;
    endTime: string;
};

type UnTimedTask = {
    taskName : string;
}
//================DB Layer-CRUD Helpers==================
async function connect_db() {

    if (db) return;
    db = await SQLite.openDatabaseAsync('mapday_db');
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS TimedTaskTable(
        taskName TEXT PRIMARY KEY NOT NULL,
        startTime TIME NOT NULL,
        endTime TIME NOT NULL
        );
        CREATE TABLE IF NOT EXISTS UnTimedTaskTable(
        taskName TEXT PRIMARY KEY NOT NULL
        );
    `);  

    
}
//CREATE
async function create_TimedTask_row_in_db(item:TimedTask){
    if(!db) throw new Error("db not connected!");

    await db.runAsync('INSERT INTO TimedTaskTable (taskName,startTime,endTime) VALUES(?,?,?)', item.taskName,item.startTime,item.endTime);

}

async function create_UnTimedTask_row_in_db(item : UnTimedTask){
    if(!db) throw new Error("db not connected!");

    await db.runAsync('INSERT INTO UnTimedTaskTable (taskName) VALUES(?)', item.taskName);

}


//READ
async function read_TimedTasks_from_db(){
    if(!db) throw new Error("db not connected!");
    const allTimedTasks = await db.getAllAsync<TimedTask>(
        'SELECT * FROM TimedTaskTable'
    );
    return {allTimedTasks};
}

async function read_UnTimedTasks_from_db(){
    if(!db) throw new Error("db not connected!");
    const allUnTimedTasks = await db.getAllAsync<UnTimedTask>(
        'SELECT * FROM UnTimedTaskTable'
    );
    return {allUnTimedTasks};
}

//UPDATE
async function update_TimedTask_row_in_db(
  oldTaskName: string,
  updatedItem: TimedTask
) {
  if (!db) throw new Error("db not connected!");

  await db.runAsync(
    'UPDATE TimedTaskTable SET taskName = ?, startTime = ?, endTime = ? WHERE taskName = ?',
    updatedItem.taskName,
    updatedItem.startTime,
    updatedItem.endTime,
    oldTaskName
  );
}

async function update_UnTimedTask_row_in_db(
  oldTaskName: string,
  updatedItem: UnTimedTask
) {
  if (!db) throw new Error("db not connected!");

  await db.runAsync(
    'UPDATE UnTimedTaskTable SET taskName = ? WHERE taskName = ?',
    updatedItem.taskName,
    oldTaskName
  );
}

//DELETE
async function delete_TimedTask_row_in_db(item: TimedTask) {
  if (!db) throw new Error("db not connected!");

  await db.runAsync(
    'DELETE FROM TimedTaskTable WHERE taskName = ?',
    item.taskName
  );
}

async function delete_UnTimedTask_row_in_db(item:UnTimedTask) {
  if (!db) throw new Error("db not connected!");

  await db.runAsync(
    'DELETE FROM UnTimedTaskTable WHERE taskName = ?',
    item.taskName
  );
}









//====================Components====================
export default function Index() {

    const [loading, setLoading] = useState(true);
    const [allTimedTasks,onChangeTimedTasks] = useState<TimedTask[]>([]);
    const [allUnTimedTasks,onChangeUnTimedTasks] = useState<UnTimedTask[]>([]);

     //Component Handlers

        //READ Handler
        async function handle_read_tasks(){
            const {allTimedTasks} = await read_TimedTasks_from_db();
            const {allUnTimedTasks} = await read_UnTimedTasks_from_db();
            onChangeTimedTasks(allTimedTasks);
            onChangeUnTimedTasks(allUnTimedTasks);
        }

        

        //WRITE Handler
        async function handle_create_TimedTask(item:TimedTask){
            await create_TimedTask_row_in_db(item);
            await handle_read_tasks();
        }

        async function handle_create_UnTimedTask(item:UnTimedTask){
            await create_UnTimedTask_row_in_db(item);
            await handle_read_tasks();
        }

        //UPDATE Handler
        async function handle_update_TimedTask(
            oldTaskName:string,
            updatedItem:TimedTask) {
                await update_TimedTask_row_in_db(oldTaskName,updatedItem);
                await handle_read_tasks();
        }

        async function handle_update_UnTimedTask(
            oldTaskName: string,
            updatedItem: UnTimedTask) {
                await update_UnTimedTask_row_in_db(oldTaskName,updatedItem);
                await handle_read_tasks();
            
        }

        //DELETE Handler
        async function handle_delete_TimedTask(item:TimedTask){
            await delete_TimedTask_row_in_db(item);
            await handle_read_tasks();
        }

        async function handle_delete_UnTimedTask(item:UnTimedTask) {
            await delete_UnTimedTask_row_in_db(item);
            await handle_read_tasks();
        }

    useEffect(  () => { 
        (async() => {
        await connect_db();
        await handle_read_tasks();
        setLoading(false);})(); 
    },[])
    
    if(loading) return(<Text>Loading…</Text>);  
    return (

    <View style={styles.screen}>
        {/* render TimedTaskTable */}
        <TimedTaskTable 
            allTimedTasks={allTimedTasks}
            handle_create_TimedTask={handle_create_TimedTask}
            handle_update_TimedTask={handle_update_TimedTask}
            handle_delete_TimedTask={handle_delete_TimedTask}/>

        {/* renderUnTimedTaskTable */}
        <UnTimedTaskTable 
            allUnTimedTasks={allUnTimedTasks}
            handle_create_UnTimedTask={handle_create_UnTimedTask}
            handle_update_UnTimedTask={handle_update_UnTimedTask}
            handle_delete_UnTimedTask={handle_delete_UnTimedTask}/>
    
    </View>
  );
}

function renderItemsTimed({
  item,
  handle_update_TimedTask,
  handle_delete_TimedTask,
}: {
  item: TimedTask;
  handle_update_TimedTask: (
    oldTaskName: string,
    updatedItem: TimedTask
  ) => Promise<void>;
  handle_delete_TimedTask: (item: TimedTask) => Promise<void>;
}){
    
    return (
        <TimedTaskTableRow  item={item} 
                            handle_delete_TimedTask={handle_delete_TimedTask}
                            handle_update_TimedTask={handle_update_TimedTask}
        />
  
    );
}
function TimedTaskTableRow({
  item,
  handle_update_TimedTask,
  handle_delete_TimedTask,
}: {
  item: TimedTask;
  handle_update_TimedTask: (
    oldTaskName: string,
    updatedItem: TimedTask
  ) => Promise<void>;
  handle_delete_TimedTask: (item: TimedTask) => Promise<void>;
}){
    const [isEditing,setEditing] = useState<boolean>(false);
    const [taskName, setTaskName] = useState(item.taskName);
    const [startTime, setStartTime] = useState(item.startTime);
    const [endTime, setEndTime] = useState(item.endTime);

    return(
        <View style={styles.rowContainer}>
          {/* display row */}
          <View style={styles.listItemRow}>
            <Text style={styles.cell}>{item.taskName}</Text>
            <Text style={styles.cell}>{item.startTime}</Text>
            <Text style={styles.cell}>{item.endTime}</Text>

            <View style={styles.rowButtons}>
              <Button title="Modify" onPress={() => setEditing(true)} />
              <Button title="Delete" onPress={() => handle_delete_TimedTask(item)} />
            </View>
          </View>

          {/* edit area */}
          {isEditing && (
            <View style={styles.editContainer}>
              <TextInput style={styles.editInput} value={taskName} onChangeText={setTaskName} />
              <TextInput style={styles.editInput} value={startTime} onChangeText={setStartTime} />
              <TextInput style={styles.editInput} value={endTime} onChangeText={setEndTime} />

              <View style={styles.editButtons}>
                <Button
                  title="Confirm"
                  onPress={async () => {
                    await handle_update_TimedTask(item.taskName,{taskName,startTime,endTime});
                    setEditing(false);
                  }}
                />
                <Button
                  title="Cancel"
                  onPress={() => {
                    setEditing(false);
                    setTaskName(item.taskName);
                    setStartTime(item.startTime);
                    setEndTime(item.endTime);
                  }}
                />
              </View>
            </View>
          )}
        </View>
    );
}
function TimedTaskTable({allTimedTasks,
  handle_create_TimedTask,
  handle_update_TimedTask,
  handle_delete_TimedTask,}: { allTimedTasks: TimedTask[];
  handle_create_TimedTask: (item: TimedTask) => Promise<void>;
  handle_update_TimedTask: (
    oldTaskName: string,
    updatedItem: TimedTask
  ) => Promise<void>;
  handle_delete_TimedTask: (item: TimedTask) => Promise<void>;} ){
    const [taskName,settaskName] = useState<string>("taskName");
    const [startTime,setstartTime] = useState<string>("startTime");
    const [endTime,setendTime] = useState<string>("endTime");
    
    return(
        
    <View style={styles.section}>
        
         <View style={styles.headerRow}>
        <Text style={styles.headerCell}>Task Name</Text>
        <Text style={styles.headerCell}>Start Time</Text>
        <Text style={styles.headerCell}>End Time</Text>
        <Text style={styles.headerCell}>Actions</Text>
      </View>


        {allTimedTasks.length===0?
            (<View><Text>No Timed Tasks Inserted</Text></View>) :
            (<FlatList
  data={allTimedTasks}
  keyExtractor={(item) => item.taskName}
  renderItem={({ item }) =>
    renderItemsTimed({
      item,
      handle_update_TimedTask,
      handle_delete_TimedTask,
    })
  }
/>)} 
        
        <View>
            <TextInput style={styles.input}
                value={taskName} onChangeText={settaskName} />
            <TextInput style={styles.input}
                value={startTime} onChangeText={setstartTime} />
            <TextInput style={styles.input}
                value={endTime} onChangeText={setendTime} />

        </View>
        <Button
            title='create new row'
            onPress={() => {handle_create_TimedTask({taskName,startTime,endTime});
                            settaskName("taskName");
                            setstartTime("startTime");
                            setendTime("endTime")}}/>

            

    </View>);
    
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

function UnTimedTaskTableRow({
  item,
  handle_update_UnTimedTask,
  handle_delete_UnTimedTask,
}: {
  item: UnTimedTask;
  handle_update_UnTimedTask: (oldTaskName:string, updatedItem:UnTimedTask)=>Promise<void>;
  handle_delete_UnTimedTask: (item:UnTimedTask)=>Promise<void>;
}) {
  const [isEditing, setEditing] = useState(false);
  const [taskName, setTaskName] = useState(item.taskName);

  return (
    <View style={styles.rowContainer}>
      <View style={styles.listItemRow}>
        <Text style={styles.cell}>{item.taskName}</Text>

        <View style={styles.rowButtons}>
          <Button title="Modify" onPress={() => setEditing(true)} />
          <Button title="Delete" onPress={() => handle_delete_UnTimedTask(item)} />
        </View>
      </View>

      {isEditing && (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.editInput}
            value={taskName}
            onChangeText={setTaskName}
          />

          <View style={styles.editButtons}>
            <Button
              title="Confirm"
              onPress={async () => {
                await handle_update_UnTimedTask(item.taskName,{ taskName });
                setEditing(false);
              }}
            />
            <Button
              title="Cancel"
              onPress={() => {
                setTaskName(item.taskName);
                setEditing(false);
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
}

function UnTimedTaskTable({
  allUnTimedTasks,
  handle_create_UnTimedTask,
  handle_update_UnTimedTask,
  handle_delete_UnTimedTask,
}: {
  allUnTimedTasks: UnTimedTask[];
  handle_create_UnTimedTask: (item: UnTimedTask) => Promise<void>;
  handle_update_UnTimedTask: (
    oldTaskName: string,
    updatedItem: UnTimedTask
  ) => Promise<void>;
  handle_delete_UnTimedTask: (item: UnTimedTask) => Promise<void>;
}){
    const [taskName,settaskName] = useState<string>("taskName");
    
    return(
        <View style={styles.section}>

            <View style={styles.headerRow}>
        <Text style={styles.headerCell}>Task Name</Text>
        <Text style={styles.headerCell}>Actions</Text>
      </View>
        {allUnTimedTasks.length===0?(<View><Text>No UnTimed Tasks Inserted</Text></View>)
        :(<FlatList
  data={allUnTimedTasks}
  keyExtractor={(item) => item.taskName}
  renderItem={({ item }) =>
    renderItemsUnTimed({
      item,
      handle_update_UnTimedTask,
      handle_delete_UnTimedTask,
    })
  }
/>)} 
            

            <View>
                <TextInput style={styles.input}
                    onChangeText={settaskName}
                    value={taskName}/>
                    
                
            </View>
            <Button
                title='create new row'
                onPress={() => {handle_create_UnTimedTask({taskName});
                                settaskName("taskName")}} />
        </View>
    )    
}


const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
  },

  section: {
    width: "95%",
    marginBottom: 40,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },

  /* HEADER */
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingBottom: 6,
    marginBottom: 8,
  },
  headerCell: {
    flex: 1,
    fontWeight: "600",
    textAlign: "center",
  },

  /* ROW */
  rowContainer: {
    marginBottom: 12,
  },
  listItemRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cell: {
    flex: 1,
    textAlign: "center",
  },
  rowButtons: {
    flexDirection: "row",
    gap: 6,
  },

  /* EDIT MODE */
  editContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#f4f4f4",
    borderRadius: 6,
  },
  editInput: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 6,
    marginBottom: 6,
    borderRadius: 4,
  },
  editButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  /* CREATE INPUTS */
  input: {
    width: 200,
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
    textAlign: "center",
  },
});