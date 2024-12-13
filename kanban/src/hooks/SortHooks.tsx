import { Sort, TaskType } from "../Types/Types"

const PriorityNumber =  {
    high:  3,
    medium: 2,
    low:  1
}

type PriorityType = {
    task_priority: "high "| "medium" | "low";
}
export const useSortHook = (sort: Sort, tasks: TaskType[]) => {
    if(sort === Sort.Priority){
        return tasks.concat().sort((taskA,taskB)=> {
            return PriorityNumber[taskA.task_priority as keyof typeof PriorityNumber] < PriorityNumber[taskB.task_priority as keyof typeof PriorityNumber] ? 1 : -1
        })
    }
    if(sort === Sort.Title){
        return tasks.sort((taskA, taskB)=> {
            return taskA.task_title.localeCompare(taskB.task_title)
        })
    }

    return tasks

    
}