// /components/TaskDayView.tsx

import { TimedTask } from "@/types/task";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const TASK_COLORS = [
  '#C8E6C9',  // light green
  '#B8B5E3',  // light purple
  '#FFE5B4',  // light orange
  '#A8D5E6',  // light blue
];

function renderHours() {
  const rows = [];

  for (let i = 0; i < 24; i++) {
    const hour = i % 12 === 0 ? 12 : i % 12;
    const period = i < 12 ? 'AM' : 'PM';
    
    rows.push(
      <View
        key={i}
        style={styles.hourRow}
      >
        <Text style={styles.hourText}>{`${hour.toString().padStart(2, '0')}:00 ${period}`}</Text>
      </View>
    );
  }

  return rows;
}

/**
 * OVERLAP DETECTION ALGORITHM
 * 
 * This function detects which tasks overlap and assigns them to columns.
 * The goal is to show overlapping tasks side-by-side instead of on top of each other.
 * 
 * How it works:
 * 1. Sort tasks by start time (earliest first)
 * 2. For each task, check if it overlaps with tasks we've already placed
 * 3. Find the first available column (lane) where this task doesn't overlap
 * 4. Place the task in that column
 * 
 * Example:
 * Task A: 9:00-11:00  -> Column 0
 * Task B: 10:00-12:00 -> Column 1 (overlaps with A, so goes to next column)
 * Task C: 11:30-13:00 -> Column 0 (doesn't overlap with A anymore, reuses column)
 */
function calculateTaskLayout(tasks: TimedTask[]): Array<{
  task: TimedTask;
  column: number;
  totalColumns: number;
}> {
  // Sort tasks by start time
  const sortedTasks = [...tasks].sort((a, b) => a.startMinutes - b.startMinutes);
  
  // Array to track which tasks are in which columns
  const columns: TimedTask[][] = [];
  
  // Result array with layout information
  const layout: Array<{
    task: TimedTask;
    column: number;
    totalColumns: number;
  }> = [];

  sortedTasks.forEach(task => {
    // Find the first column where this task doesn't overlap
    let placedInColumn = -1;
    
    for (let colIndex = 0; colIndex < columns.length; colIndex++) {
      const tasksInColumn = columns[colIndex];
      
      // Check if task overlaps with any task in this column
      const hasOverlap = tasksInColumn.some(existingTask => 
        // Two tasks overlap if:
        // task starts before existing task ends AND task ends after existing task starts
        task.startMinutes < existingTask.endMinutes && 
        task.endMinutes > existingTask.startMinutes
      );
      
      if (!hasOverlap) {
        // Found a column with no overlap, place task here
        placedInColumn = colIndex;
        columns[colIndex].push(task);
        break;
      }
    }
    
    // If no suitable column found, create a new one
    if (placedInColumn === -1) {
      placedInColumn = columns.length;
      columns.push([task]);
    }
    
    layout.push({
      task,
      column: placedInColumn,
      totalColumns: Math.max(columns.length, 1),
    });
  });

  // Update totalColumns for all tasks to reflect the maximum columns used
  const maxColumns = columns.length;
  layout.forEach(item => {
    item.totalColumns = maxColumns;
  });

  return layout;
}

function renderTasks(allTimedTasks: TimedTask[]) {
  // Get layout with overlap detection
  const taskLayout = calculateTaskLayout(allTimedTasks);
  
  return taskLayout.map((layoutItem, index) => {
    const { task, column, totalColumns } = layoutItem;
    const top = task.startMinutes; 
    const height = task.endMinutes - task.startMinutes;

    if (height <= 0) return null;

    /**
     * POSITIONING LOGIC FOR OVERLAPPING TASKS
     * 
     * When tasks overlap, we divide the available horizontal space into columns.
     * Each task takes up a portion of the width based on:
     * - Which column it's in (column index)
     * - How many total columns are needed (totalColumns)
     * 
     * Example with 2 overlapping tasks:
     * - Available width: 100%
     * - Each task gets: 100% / 2 = 50% width
     * - Task in column 0: left offset = 0%, width = 50%
     * - Task in column 1: left offset = 50%, width = 50%
     * 
     * We use percentages so it works with any screen size.
     */
    const widthPercentage = 100 / totalColumns;
    const leftPercentage = (column * widthPercentage);

    return (
      <View
        key={task.id}
        style={[
          styles.taskBlock,
          {
            top,
            height,
            backgroundColor: TASK_COLORS[index % TASK_COLORS.length],
            // Position the task block based on its column
            left: `${leftPercentage}%`,
            width: `${widthPercentage - 2}%`, // Subtract 2% for visual gap between columns
          }
        ]}
      >
        <Text style={styles.taskBlockText} numberOfLines={2}>
          {task.taskName}
        </Text>
        {/* Show column indicator for debugging (optional - you can remove this) */}
        {totalColumns > 1 && (
          <Text style={styles.columnIndicator}>
            {column + 1}/{totalColumns}
          </Text>
        )}
      </View>
    );
  });
}

export default function TaskDayView({allTimedTasks}:{allTimedTasks:TimedTask[]} ) {
  return (
    <ScrollView 
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.timelineContainer}>
        {renderHours()}
        {renderTasks(allTimedTasks)}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  timelineContainer: {
    height: 1440,
    position: 'relative',
    paddingHorizontal: 16,
  },
  hourRow: {
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    justifyContent: 'center',
  },
  hourText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
  },
  taskBlock: {
    position: 'absolute',
    right: 16,
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  taskBlockText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  columnIndicator: {
    fontSize: 10,
    fontWeight: '500',
    color: '#8E8E93',
    marginTop: 4,
  },
});
// ```

// ## Explanation of Changes:

// ### 1. **Refresh Button** (Simple):
// - Added a circular green button in the top-right corner of the header
// - Created `handleRefresh()` function that calls `handle_read_tasks()`
// - Added `refreshing` state to show loading animation (rotating icon)
// - The button is disabled while refreshing to prevent multiple simultaneous refreshes

// ### 2. **Overlap Detection** (Complex - Read Carefully):

// **The Problem**: 
// When tasks overlap in time, they were being rendered on top of each other, making them invisible and unusable.

// **The Solution**:
// I implemented a column-based layout system that detects overlaps and arranges tasks side-by-side.

// **How `calculateTaskLayout()` Works**:

// 1. **Sort by start time**: Tasks are sorted earliest-to-latest so we process them in chronological order

// 2. **Column assignment**: For each task, we check existing columns to find one where it doesn't overlap
//    - If Task A is 9:00-11:00 in column 0
//    - And Task B is 10:00-12:00
//    - Task B can't go in column 0 (overlaps with A)
//    - So Task B goes in column 1

// 3. **Overlap detection formula**:
// ```
//    Tasks overlap if:
//    taskA.start < taskB.end AND taskA.end > taskB.start