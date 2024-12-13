import express from 'express';
import { verifySessionToken } from '../sessionUtils.js';
import { pool } from '../index.js';
import { queries } from '../queries/query.js';
const router = express();
/*
router.post('/addTask', async (req,res)=> {
    const {taskTitle, taskPriority, taskStatus, projectId} = req.body
    console.log(taskTitle, taskPriority, taskStatus, projectId)
    
    try{
        let result = await pool.query(queries.tasks.addTaskQ, [taskTitle, taskPriority, taskStatus, projectId])
        if (result.rowCount > 0){
            res.status(200).json({data:result.rows, message: "succesfully added", status:"success"});

        }else{
            res.status(200).json({data:null, message: "can't be added but worked", status:"success"})
        }
    }catch(e){
        console.log(e)
        res.status(403).json({error: "does not work"})
    }
})
*/
router.get('/getTaskMembersByProjectId', async (req, res) => {
    const { projectId } = req.query;
    if (projectId === undefined) {
        console.log("dalodsa");
        return res.sendStatus(404);
    }
    try {
        let result = await pool.query(queries.tasks.getTaskMembersUByProjectIdQ, [projectId]);
        if (result.rowCount > 0) {
            console.log("dalpda");
            res.status(200).json({ data: result.rows, message: "found task members", status: "success" });
        }
        else {
            console.log("dalpda2");
            res.status(200).json({ data: [], message: "no results found", status: "success" });
        }
    }
    catch (e) {
        console.log(e);
        res.status(403).json({ error: "cannot get members due to errors" });
    }
});
router.post(`/addTaskMemberToTaskId`, async (req, res) => {
    const { taskId, projectId, userId } = req.body;
    try {
        let result = await pool.query(queries.tasks.addTaskMemberQ, [userId, projectId, taskId]);
        if (result.rowCount > 0) {
            console.log(result.rowCount);
            console.log(result.rows);
            res.status(200).json({ data: result.rows, message: "member added", status: "success" });
        }
        else {
            res.status(200).json({ data: null, message: "member not added", status: "success" });
        }
    }
    catch (e) {
        console.log(e);
        res.status(403).json({ error: "cannot add task member due to errors" });
    }
});
router.get('/getTasksAndMyTasksByProjectId/', verifySessionToken, async (req, res) => {
    const { userId } = req;
    const { projectId } = req.query;
    try {
        let result = await pool.query(queries.tasks.getTaskByProjectIdQ, [projectId]);
        if (result.rowCount > 0) {
            let resultMyTasks = await pool.query(queries.tasks.getUserTask, [projectId, userId]);
            if (result.rowCount > 0) {
                console.log("found some of user tasks");
            }
            else {
                console.log("no tasks found");
            }
            res.status(200).json({ data: result.rows, data2: resultMyTasks.rows, message: "found Tasks", status: "success" });
        }
        else {
            res.status(200).json({ data: null, message: "no Tasks present", status: "success" });
        }
    }
    catch (e) {
        console.log(e);
        res.status(403).json({ error: "does not work" });
    }
});
router.post('/addTaskFull', async (req, res) => {
    if (req.body.data) {
        for (let key of Object.keys(req.body.data)) {
            console.log(key); // Logs the keys inside the 'data' object, like 'title', 'priority', etc.
            console.log("dkasodksa");
        }
    }
    else {
        console.log('No data found in request body');
    }
    const { title, priority, status, projectId } = req.body;
    console.log(title, priority, status, projectId);
    try {
        let result = await pool.query(queries.tasks.addTaskFullQ, [title, priority, status, projectId, "pending"]);
        if (result.rowCount > 0) {
            res.status(200).json({ data: result.rows, message: "succesfully added", status: "success" });
        }
        else {
            res.status(200).json({ data: null, message: "succesfull but did not add", status: "success" });
        }
    }
    catch (e) {
        console.log(e);
        res.status(403).json({ error: "cannot add task" });
    }
});
router.patch('/updateTaskUpdate/:taskId', async (req, res) => {
    const { taskId } = req.params;
    const { taskUpdateOption } = req.body;
    console.log(taskUpdateOption, "THIS SHOULD BE task update options");
    console.log(taskUpdateOption + "THIS SHOULD BE task update options");
    try {
        let result = await pool.query(queries.tasks.updateTaskUpdate, [taskUpdateOption, taskId]);
        if (result.rowCount > 0) {
            res.status(200).json({ data: result.rows, message: "succesfully updated task status", status: "success" });
        }
        else {
            res.status(200).json({ data: null, message: "did not update task status but query was succesful", status: "success" });
        }
    }
    catch (e) {
        console.log(e);
        res.status(403).json({ error: "did not update task status due to errors" });
    }
});
router.delete(`/deleteTask/:taskId`, async (req, res) => {
    const { taskId } = req.params;
    try {
        let result = await pool.query(queries.tasks.deleteTaskQ, [taskId]);
        if (result.rowCount > 0) {
            res.status(200).json({ data: result.rows, message: "succesfully deleted", status: "success" });
        }
        else {
            res.status(200).json({ data: null, message: "did not delete but query was succesful", status: "success" });
        }
    }
    catch (e) {
        console.log(e);
        res.status(403).json({ error: "does not work" });
    }
});
router.patch(`/updateTask/:taskId`, async (req, res) => {
    const { taskId } = req.params;
    const { title, status, priority } = req.body;
    try {
        let result = await pool.query(queries.tasks.updateTaskQ, [title, status, priority, taskId]);
        if (result.rowCount > 0) {
            res.status(200).json({ data: result.rows, message: "succesfully updated", status: "success" });
        }
        else {
            res.status(200).json({ data: null, message: "did not update but query was succesful", status: "success" });
        }
    }
    catch (e) {
        console.log(e);
        res.status(403).json({ error: "does not work" });
    }
});
router.patch(`/updateTaskStatus`, async (req, res) => {
    const { taskId, taskStatus } = req.body;
    try {
        let result = await pool.query(queries.tasks.updateTaskStatusQ, [taskStatus, taskId]);
        if (result.rowCount > 0) {
            res.status(200).json({ data: result.rows, message: "succesfully updated", status: "success" });
        }
        else {
            res.status(200).json({ data: null, message: "did not update but query was succesful", status: "success" });
        }
    }
    catch (e) {
        console.log(e);
        res.status(403).json({ error: "does not work" });
    }
});
export { router };
//# sourceMappingURL=taskRoutes.js.map