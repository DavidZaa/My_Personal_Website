import { getTasks } from "@/lib/data";
import { TaskList } from "./TaskList";

export default async function TasksPage() {
  const tasks = await getTasks();
  return <TaskList initialTasks={tasks} />;
}
