import TaskTimeLine from '@/components/TaskTimeLine';
import { connect_db } from '@/db/database';
import { read_TimedTasks_from_db } from '@/db/timedtasks';
import { TimedTask } from '@/types/task';

import { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';

export default function Task() {
    const[allTimedTasks,onChangeTimedTasks]=useState<TimedTask[]>([]);
    const [loading,setLoading]=useState(true);
    const [nowMinutes,setnowMinutes] = useState<number>(minutesSinceMidnight(new Date()));
    
    
    async function handle_read_tasks(){
        const allTimedTasks = await read_TimedTasks_from_db();
        onChangeTimedTasks(allTimedTasks);
    
    }
    useEffect( () =>{
        (async ()=>{
            await connect_db;
            await handle_read_tasks();
            setLoading(false);
        })();
    },[])

    if(loading) return (
        <View>
            <Text>loading tasks</Text>
        </View>
    );
    return (
        
        <View>
        <TaskTimeLine allTimedTasks={allTimedTasks}
            nowMinutes={nowMinutes}/>
        
        <Button
         title='refresh tasks'
         onPress= {async () => {setnowMinutes(minutesSinceMidnight(new Date()))
            await handle_read_tasks();
         }
            } />
        </View>
  );
}

function minutesSinceMidnight(selectedDate: Date): number {
  return selectedDate.getHours() * 60 + selectedDate.getMinutes();
}


