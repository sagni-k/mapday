import { UnTimedTask } from "@/types/task";
import { connect_db } from "./database";

export async function create_UnTimedTask_row_in_db(item: Omit<UnTimedTask, 'id'>){
    const db = await connect_db();
    if(!db) throw new Error("db not connected!");

    await db.runAsync('INSERT INTO UnTimedTaskTable (taskName) VALUES(?)',
        item.taskName,
        );

}

export async function read_UnTimedTasks_from_db() {
    const db = await connect_db();
    if(!db) throw new Error("db not connected!");

    const allUnTimedTasks = await db.getAllAsync<UnTimedTask>(
        'SELECT * FROM UnTimedTaskTable '
    );
    return allUnTimedTasks;
}

export async function update_UnTimedTask_row_in_db(
    oldItemId:number,
    newItem:Omit<UnTimedTask, 'id'>
) {
    const db = await connect_db();
    if(!db) throw new Error("db not connected!");

    await db.runAsync(
    'UPDATE UnTimedTaskTable SET taskName = ? WHERE id = ?',
    newItem.taskName,
    oldItemId
  );
}

export async function delete_UnTimedTask_row_in_db(id:number) {
    const db = await connect_db();
    if(!db) throw new Error("db not connected!");

    await db.runAsync(
        'DELETE FROM UnTimedTaskTable WHERE id = ?',
        id
    );
}