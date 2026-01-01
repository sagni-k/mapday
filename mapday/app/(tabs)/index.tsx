import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { FlatList, Text, View } from "react-native";

let db: SQLite.SQLiteDatabase | null = null;

type TimedTask ={
    taskName: string;
    startTime: string;
    endTime: string;
};

type UnTimedTask = {
    taskName : string;
}

async function connect_db() {
    const db = await SQLite.openDatabaseAsync('mapday_db');
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

    const allTimedTasks = await db.getAllAsync<TimedTask>(
        'SELECT * FROM TimedTaskTable'
    );
    const allUnTimedTasks = await db.getAllAsync<UnTimedTask>(
        'SELECT * FROM UnTimedTaskTable'
    );

    return {allTimedTasks,allUnTimedTasks};
}

export default function Index() {
    const [loading, setLoading] = useState(true);
    const [allTimedTasks,onChangeTimedTasks] = useState<TimedTask[]>([]);
    const [allUnTimedTasks,onChangeUnTimedTasks] = useState<UnTimedTask[]>([]);
    useEffect(  () => { 
        (async() => {
        const {allTimedTasks,allUnTimedTasks} = await connect_db();
        onChangeTimedTasks(allTimedTasks);
        onChangeUnTimedTasks(allUnTimedTasks);
        setLoading(false);})(); 
    },[])
    
    if(loading) return(<Text>Loading…</Text>);  
    return (

    <View>
        {/* render TimedTaskTable */}
        <TimedTaskTable allTimedTasks={allTimedTasks}/>

        {/* renderUnTimedTaskTable */}
        <UnTimedTaskTable allUnTimedTasks={allUnTimedTasks}/>
    
    </View>
  );
}

function renderItemsTimed({item}: { item: TimedTask }){
    return (
    <View >
      <Text>{item.taskName}</Text>
      <Text>{item.startTime}</Text>
      <Text>{item.endTime}</Text>
    </View>
  );
}

function TimedTaskTable({allTimedTasks}: {allTimedTasks:TimedTask[]} ){
    if(allTimedTasks.length==0) return (<View><Text>No Timed Tasks Inserted</Text></View>);
    return(
    <View>
        
        <View>
            <Text>Task Name</Text>
            <Text>Start Time</Text>
            <Text>End Time</Text>
        </View>

        <FlatList
            data={allTimedTasks}
            keyExtractor={(item) => item.taskName}
            renderItem={renderItemsTimed}
        />

    </View>);
    
}

function renderItemsUnTimed({item}:{item : UnTimedTask}){
    return(
        <View>
            <View>
                <Text>{item.taskName}</Text>
            </View>
        </View>
    )
}

function UnTimedTaskTable({allUnTimedTasks}:{allUnTimedTasks : UnTimedTask[]}){
    if(allUnTimedTasks.length==0) return (<View><Text>No UnTimed Tasks Inserted</Text></View>);
    return(
        <View>

            <View>
                <Text>Task Name</Text>
            </View>

            <FlatList
                data={allUnTimedTasks}
                keyExtractor={(item) => item.taskName}
                renderItem={renderItemsUnTimed}
            />

        </View>
    )    
}


