import { TimedTask } from "@/types/task";
import { ScrollView, Text, View } from "react-native";


const TASK_COLORS = [
  "rgba(255, 99, 132, 0.45)",   // red-ish
  "rgba(54, 162, 235, 0.45)",   // blue-ish
  "rgba(255, 206, 86, 0.45)",   // yellow-ish
  "rgba(75, 192, 192, 0.45)",   // green-ish
];


function renderHours() {
  const rows = [];

  for (let i = 0; i < 24; i++) {
    rows.push(
      <View
        key={i}
        style={{
          height: 60,
          borderBottomWidth: 1,
          justifyContent: "center",
          paddingLeft: 8,
        }}
      >
        <Text>{i}:00</Text>
      </View>
    );
  }

  return rows;
}


function renderTasks(allTimedTasks: TimedTask[]) {
  return allTimedTasks.map((task, index) => {
    const top = task.startMinutes; 
    const height = task.endMinutes - task.startMinutes;

    if (height <= 0) return null; 

    return (
      <View
        key={task.id}
        style={{
          position: "absolute",
          top,
          height,
          left: 0,
          right: 0,
          backgroundColor: TASK_COLORS[index % TASK_COLORS.length],
          borderRadius: 6,
        }}
      />
    );
  });
}

export default function TaskDayView({allTimedTasks}:{allTimedTasks:TimedTask[]} ) {
  return (
    <ScrollView style={{ flex: 1 }}>
  <View style={{ height: 1440, position: "relative" }}>
    {renderHours()}
    {renderTasks(allTimedTasks)}
  </View>
</ScrollView>


  );
}

