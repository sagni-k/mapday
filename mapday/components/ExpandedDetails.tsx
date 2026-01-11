import { TimedTask } from "@/types/task";
import { StyleSheet, Text, View } from "react-native";

export default function ExpandedDetails({ task }: { task: TimedTask }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Task Details</Text>

      <Text style={styles.row}>
        Start: {formatMinutes(task.startMinutes)}
      </Text>
      <Text style={styles.row}>
        End: {formatMinutes(task.endMinutes)}
      </Text>

      {/* Add more fields here later if needed */}
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
  container: {
    padding: 12,
    marginBottom: 6,
    borderRadius: 8,
    backgroundColor: "#2a2a2a",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#ffffff",
  },
  row: {
    fontSize: 13,
    color: "#cccccc",
    marginBottom: 4,
  },
});
