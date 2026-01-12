import { TimedTask } from "@/types/task";
import { StyleSheet, Text, View } from "react-native";

export default function TaskCard({ task }: { task: TimedTask }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{task.taskName}</Text>
      <Text style={styles.time}>
        {formatMinutes(task.startMinutes)} – {formatMinutes(task.endMinutes)}
      </Text>
    </View>
  );
}

function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#1e1e1e",
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  time: {
    marginTop: 4,
    fontSize: 13,
    color: "#b0b0b0",
  },
});
