export type TimedTask = {
  id: number;
  taskName: string;
  startMinutes: number;
  endMinutes: number;
};

export type UnTimedTask = {
    id: number;
    taskName : string;
}