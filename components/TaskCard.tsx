// /components/TaskCard.tsx

import { TimedTask } from "@/types/task";
import { StyleSheet, Text, View } from "react-native";

export default function TaskCard({ task }: { task: TimedTask }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{task.taskName}</Text>
        <View style={styles.activeBadge}>
          <View style={styles.activeDot} />
          <Text style={styles.activeText}>Active</Text>
        </View>
      </View>
      
      <View style={styles.timeContainer}>
        <View style={styles.timeItem}>
          <Text style={styles.timeLabel}>Start</Text>
          <Text style={styles.timeValue}>{formatMinutes(task.startMinutes)}</Text>
        </View>
        <View style={styles.timeDivider} />
        <View style={styles.timeItem}>
          <Text style={styles.timeLabel}>End</Text>
          <Text style={styles.timeValue}>{formatMinutes(task.endMinutes)}</Text>
        </View>
      </View>

      <Text style={styles.tapHint}>Tap to see details</Text>
    </View>
  );
}

function formatMinutes(minutes: number) {
  const totalMinutes = minutes % 1440;
  let hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const paddedMinutes = mins.toString().padStart(2, "0");
  return `${hours}:${paddedMinutes} ${period}`;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#A8D5A5',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    flex: 1,
    marginRight: 12,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2D5F2E',
    marginRight: 6,
  },
  activeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D5F2E',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  timeItem: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
    fontWeight: '500',
  },
  timeValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  timeDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 12,
  },
  tapHint: {
    fontSize: 12,
    color: '#8E8E93',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});