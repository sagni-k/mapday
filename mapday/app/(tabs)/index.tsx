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
// DB Layer - CRUD Helpers
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









//Components
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
        <TimedTaskTable allTimedTasks={allTimedTasks}
        handle_create_TimedTask={handle_create_TimedTask}/>

        {/* renderUnTimedTaskTable */}
        <UnTimedTaskTable allUnTimedTasks={allUnTimedTasks}
        handle_create_UnTimedTask={handle_create_UnTimedTask}/>
    
    </View>
  );
}

function renderItemsTimed({item}: { item: TimedTask }){
    return (
    <View style={styles.listItem}>
      <Text>{item.taskName}</Text>
      <Text>{item.startTime}</Text>
      <Text>{item.endTime}</Text>
    </View>
  );
}

function TimedTaskTable({allTimedTasks,handle_create_TimedTask}: {allTimedTasks:TimedTask[];handle_create_TimedTask:(item:TimedTask) => Promise<void>;} ){
    const [taskName,settaskName] = useState<string>("taskName");
    const [startTime,setstartTime] = useState<string>("startTime");
    const [endTime,setendTime] = useState<string>("endTime");
    
    return(
    <View style={styles.section}>
        
        <View>
            <Text>Task Name</Text>
            <Text>Start Time</Text>
            <Text>End Time</Text>
        </View>


        {allTimedTasks.length===0?
            (<View><Text>No Timed Tasks Inserted</Text></View>) :
            (<FlatList
            data={allTimedTasks}
            keyExtractor={(item) => item.taskName}
            renderItem={renderItemsTimed}
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
            onPress={() => {handle_create_TimedTask({taskName,startTime,endTime})}}/>

            

    </View>);
    
}

function renderItemsUnTimed({item}:{item : UnTimedTask}){
    return(
        <View  style={styles.listItem}>
            <View>
                <Text>{item.taskName}</Text>
            </View>
        </View>
    )
}

function UnTimedTaskTable({allUnTimedTasks,handle_create_UnTimedTask}:{allUnTimedTasks : UnTimedTask[]; handle_create_UnTimedTask:(item:UnTimedTask)=>Promise<void>;}){
    const [taskName,settaskName] = useState<string>("taskName");
    
    return(
        <View style={styles.section}>

            <View>
                <Text>Task Name</Text>
            </View>
        {allUnTimedTasks.length===0?(<View><Text>No UnTimed Tasks Inserted</Text></View>)
        :(<FlatList
                data={allUnTimedTasks}
                keyExtractor={(item) => item.taskName}
                renderItem={renderItemsUnTimed}
            />)} 
            

            <View>
                <TextInput style={styles.input}
                    onChangeText={settaskName}
                    value={taskName}/>
                    
                
            </View>
            <Button
                title='create new row'
                onPress={() => {handle_create_UnTimedTask({taskName})}} />
        </View>
    )    
}


const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 40,
  },
  section: {
    width: "90%",
    alignItems: "center",
    marginBottom: 40,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  row: {
    alignItems: "center",
    marginBottom: 8,
  },
  input: {
    width: 200,
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
    textAlign: "center",
  },
  listItem: {
    alignItems: "center",
    marginBottom: 6,
  },
});