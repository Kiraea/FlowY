import express from 'express';
const router = express();
import { pool } from '../index.js';
import pg from 'pg'
import {queries} from '../queries/query.js'
import {verifySessionToken} from '../sessionUtils.js'

router.get('/getProjects', async (req,res)=> {
    try{
        let result = await pool.query(queries.project.getProjectsQ);
        if (result.rowCount > 0 ){
            res.status(200).json({data: result.rows, message: "foundProjects", status:"success"});
        }else{
            res.status(200).json({data : null, message: "did not find projects", status:"success"});
        }
    }catch(e){
        res.status(403).json({error: e})
    }
})

router.get(`/getProjectsById`, async(req,res)=>{
    try{
        let result = await pool.query(queries.project.getProjectByIdQ);
        if (result.rowCount > 0){
            res.status(200).json({data: result.rows, message: "foundProjects", status:"success"});
        }else{
            res.status(200).json({data : null, message: "did not find projects", status:"success"});
        }
    }catch(e){
        res.status(403).json({error: e})
    }
})
router.get(`/getProjectsByUserId`, verifySessionToken, async(req,res)=>{
    const {userId} = req || null
    if(userId === null){
        res.status(403).json({error: "did not find userId, not verified"});
    }else{
        try{
            console.log(userId)
            let result = await pool.query(queries.project.getProjectByUserIdQ, [userId])
            if (result.rowCount > 0){
                res.status(200).json({data: result.rows, message: "foundProjects", status:"success"});
            }else{
                res.status(200).json({data : null, message: "did not find projects", status:"success"});
            }
        }catch(e){
            res.status(403).json({error: e});
            console.log(e);
        }
    }
})

router.post('/getProjectMembersById', async(req,res)=>{
    const {projectId} = req.body
    console.log(projectId + "Dsadas");
    try{
        let result = await pool.query(queries.project.getProjectMembers, [projectId]);
        if (result.rowCount > 0) {
            res.status(200).json({data: result.rows, message: "foundProjects", status:"success"});
        }else{
            res.status(200).json({data : null, message: "did not find projects", status:"success"});
        }
    }catch(e){
        res.status(500).json({error: e})
    }
})


const checkIfValidURL = (urlLink: string) => {
    if (urlLink.includes('github.com/')){
        return true;
    }else{
        return false;
    }
    
}
router.post('/createProject', verifySessionToken, async (req,res)=> {
    const {name, description, link, specifications, members} = req.body
    const {userId} = req
    let hasMembers = false;
    const githubLink = link === '' ? null : link
    if (req.body.members != null || req.body.members != undefined){
        hasMembers = true
    }

    if (githubLink !== null){

        if (checkIfValidURL(githubLink) === false){
            res.status(402).json({error: "invalid github link"});
            return;
        }
    }

    try{
        if (!hasMembers){ // no other members inserted
            let res0: pg.QueryResult = await pool.query(queries.project.addProjectsQ, [name, description, githubLink, specifications])
            if (res0.rowCount > 0){
                let idR = res0.rows[0].id;
                try{
                    let res2: pg.QueryResult = await pool.query(queries.project.addProjectMembersQ, [idR, userId, 'leader'])
                    console.log("res2:", res2)
                    if (res2.rowCount > 0){
                        res.status(200).json({result: res2.rows});
                    }
                }catch(e){
                    res.status(500).json({error: e});
                }
            }
        }else{
            let res0: pg.QueryResult = await pool.query(queries.project.addProjectsQ, [name, description, githubLink, specifications])
            if (res0.rowCount > 0){
                let idR = res0.rows[0].id;
                let res2: pg.QueryResult = await pool.query(queries.project.addProjectMembersQ, [idR, userId, 'leader'])
                for (let i = 0; i<members.length;i++){
                    await pool.query(queries.project.addProjectMembersQ, [idR, members[i], 'member'])
                }
                res.status(200).json({result: res2});
            }
        }
    }catch(e){
        res.status(402).json({error: e})
    }
})


export {router}