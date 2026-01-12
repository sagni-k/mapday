import { TimedTask } from "@/types/task";
import { connect_db } from "./database";

export async function create_TimedTask_row_in_db(item: Omit<TimedTask, 'id'>){
    const db = await connect_db();
    if(!db) throw new Error("db not connected!");

    await db.runAsync('INSERT INTO TimedTaskTable (taskName,startMinutes,endMinutes) VALUES(?,?,?)',
         item.taskName,
         item.startMinutes,
         item.endMinutes);

}


   
export async function read_TimedTasks_from_db() {
    const db = await connect_db();
    if(!db) throw new Error("db not connected!");

    const allTimedTasks = await db.getAllAsync<TimedTask>(
        'SELECT * FROM TimedTaskTable ORDER BY startMinutes;'
    );
    return allTimedTasks;
}

export async function update_TimedTask_row_in_db(
    oldItemId:number,
    newItem:Omit<TimedTask, 'id'>
) {
    const db = await connect_db();
    if(!db) throw new Error("db not connected!");

    await db.runAsync(
    'UPDATE TimedTaskTable SET taskName = ?, startMinutes = ?, endMinutes = ? WHERE id = ?',
    newItem.taskName,
    newItem.startMinutes,
    newItem.endMinutes,
    oldItemId
  );
}

export async function delete_TimedTask_row_in_db(id:number) {
    const db = await connect_db();
    if(!db) throw new Error("db not connected!");

    await db.runAsync(
        'DELETE FROM TimedTaskTable WHERE id = ?',
        id
    );
}