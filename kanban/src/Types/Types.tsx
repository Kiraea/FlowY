export type TaskType =  {
  id: string; // UUID format
  task_title: string; // Corresponds to "task_title"
  task_priority: string; // Corresponds to "task_priority_type", replace `string` with an enum if needed
  task_status: string; // Corresponds to "task_status_type", replace `string` with an enum if needed
  task_update: string; //dasdsadsa
  created_at?: Date; // "created_at" is optional because of the DEFAULT value
  project_id: string; // UUID of the associated project
}


export enum Sort {
  Title = "title",
  Priority = "priority"
}

export enum TaskStyle {
  KanbanStyle = "KanbanStyle",
  PendingStyle = "PendingStyle"
}
export enum TaskUpdateOption {
  accept = "accepted",
  reject = "rejected",
}