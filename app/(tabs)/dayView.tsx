import TaskDayView from '@/components/TaskDayView';
import { connect_db } from '@/db/database';
import { read_TimedTasks_from_db } from '@/db/timedtasks';
import { TimedTask } from '@/types/task';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';


export default function DayView(){
    const[allTimedTasks,onChangeTimedTasks]=useState<TimedTask[]>([]);
    const [loading,setLoading]=useState(true);


    async function handle_read_tasks(){
        const allTimedTasks = await read_TimedTasks_from_db();
        onChangeTimedTasks(allTimedTasks);
    
    }


    useEffect( () =>{
        (async ()=>{
            await connect_db();
            await handle_read_tasks();
            setLoading(false);
        })();
    },[])

    if(loading) return (
        <View>
            <Text>loading tasks</Text>
        </View>
    );


    return(
        <View style={{flex:1}}>
            <TaskDayView allTimedTasks={allTimedTasks}></TaskDayView>
        </View>
    );

}