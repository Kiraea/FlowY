import express from 'express'
import { verifySessionToken } from '../sessionUtils.js'
import { pool } from '../index.js'
import { queries } from '../queries/query.js'
const router = express()


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

router.get('/getTaskMembersByProjectId', async (req: any,res: any)=> {
    const {projectId} = req.query
    if (projectId === undefined){
        console.log("dalodsa");
        return res.sendStatus(404)
    }

    try{
        let result = await pool.query(queries.tasks.getTaskMembersUByProjectIdQ, [projectId])
        if (result.rowCount > 0){
            console.log("dalpda")
            res.status(200).json({data:result.rows, message: "found task members", status:"success"});
        }else{
            console.log("dalpda2")
            res.status(200).json({data:null, message: "no reuslts found", status:"success"})
        }
    }catch(e){
        console.log(e);
        res.status(403).json({error: "cannot get members due to errors"});
    }
})

router.post(`/addTaskMemberToTaskId`, async(req,res)=> {
    const {taskId, projectId, userId} = req.body
    try{
        let result = await pool.query(queries.tasks.addTaskMemberQ, [userId, projectId, taskId])
        if (result.rowCount > 0) {
            res.status(200).json({data:result.rows, message: "member added", status:"success"});
        }else{
            res.status(200).json({data:null, message: "member not added", status:"success"})
        }
    }catch(e){
        console.log(e);
        res.status(403).json({error: "cannot add task member due to errors"});
    }
})

router.get('/getTasks', async (req,res)=> {
    try{
        let result = await pool.query(queries.tasks.getTasksQ)
        if (result.rowCount > 0){
            res.status(200).json({data:result.rows, message: "found Tasks", status:"success"});
        }else{
            res.status(200).json({data:null, message: "no Tasks present", status:"success"})
        }
    }catch(e){
        console.log(e)
        res.status(403).json({error: "does not work"})
    }
})

router.patch(`/updateTaskStatus`, async(req,res)=> {
    const {taskId, taskStatus} = req.body
    try{
        let result = await pool.query(queries.tasks.updateTaskStatusQ, [taskStatus, taskId]);
        if (result.rowCount > 0){
            res.status(200).json({data:result.rows, message: "succesfully updated", status:"success"});
        }else{
            res.status(200).json({data:null, message: "did not update but query was succesful", status:"success"})
        }
    }catch(e){
        console.log(e);
        res.status(403).json({error: "does not work"})
    }
})
export {router}