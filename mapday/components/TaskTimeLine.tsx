import { TimedTask } from "@/types/task";
import { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import ExpandedDetails from "./ExpandedDetails";
import TaskCard from "./TaskCard";

export default function TaskTimeLine(
    {allTimedTasks,nowMinutes}:{allTimedTasks:TimedTask[],nowMinutes:number} 
){
    
    const [expandedid,setExpandedid] = useState<number | null>(null);
    const visibleTasks = filterAllTimedTasks(allTimedTasks);
    function renderSortedItems(item : TimedTask ){

        const isExpanded = (item.id===expandedid)

        return (
            <View>
                {isExpanded && <ExpandedDetails task ={item} /> }
                <Pressable
                onPress={() =>
                {setExpandedid(prev => (prev===item.id?null:item.id))}
                }>

                 <TaskCard task = {item}/> 
                </Pressable>

            </View>
        );
    }

    function filterAllTimedTasks(allTimedTasks: TimedTask[]) {
  return allTimedTasks.filter(task =>
    task.startMinutes <= nowMinutes &&
    task.endMinutes > nowMinutes
  );
}


    useEffect(() => {
        setExpandedid(null);
    }, [nowMinutes]);
    return(
        <View>
            {visibleTasks.length==0?(<Text>No Timed tasks inserted</Text>):
            (<FlatList
            data={visibleTasks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={ ({item}) =>
                renderSortedItems(
                    item
                )
            }
        />)}

        
        </View>
    );
    
}



