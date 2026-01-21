// /components/ExpandedDetails.tsx

import { TimedTask } from "@/types/task";
import { StyleSheet, Text, View } from "react-native";

export default function ExpandedDetails({ task }: { task: TimedTask }) {
  const duration = task.endMinutes - task.startMinutes;
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>📋 Task Details</Text>
      </View>

      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Start Time</Text>
          <Text style={styles.detailValue}>{formatMinutes(task.startMinutes)}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>End Time</Text>
          <Text style={styles.detailValue}>{formatMinutes(task.endMinutes)}</Text>
        </View>

        <View style={[styles.detailItem, styles.fullWidth]}>
          <Text style={styles.detailLabel}>Duration</Text>
          <Text style={styles.detailValue}>
            {hours > 0 && `${hours}h `}{minutes}min
          </Text>
        </View>

        <View style={[styles.detailItem, styles.fullWidth]}>
          <Text style={styles.detailLabel}>Task ID</Text>
          <Text style={styles.detailValue}>#{task.id}</Text>
        </View>
      </View>
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
  container: {
    backgroundColor: '#F5F5F7',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  header: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
  },
  fullWidth: {
    minWidth: '100%',
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
  },
});