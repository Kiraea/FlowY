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

router.get(`/getProjectsById/:projectId`, async(req,res)=>{
    const {projectId} = req.params
    try{
        let result = await pool.query(queries.project.getProjectByIdQ, [projectId]);
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
    const {userId} = req || null;
    if(userId === null){
        res.status(403).json({error: "did not find userId, not verified"});
    }else{
        try{
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

router.get('/getProjectMembersById', async(req,res)=>{
    const {projectId} = req.query
    try{
        let result = await pool.query(queries.project.getProjectMembers, [projectId]);
        if (result.rowCount > 0) {
            res.status(200).json({data: result.rows, message: "found project memebrs", status:"success"});
        }else{
            res.status(200).json({data : null, message: "did not found project members but success", status:"success"});
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
    const {name, description, link, specifications, members} = req.body.projectDetails
    const {userId} = req



    let hasMembers = Array.isArray(members) && members.length > 0;
    const githubLink = link === '' ? null : link
    if (githubLink !== null){

        if (checkIfValidURL(githubLink) === false){
            res.status(405).json({error: "invalid github link"});
            return;
        }
    }

    try{
        if (!hasMembers){ // no other members inserted
            let res0: pg.QueryResult = await pool.query(queries.project.addProjectsQ, [name, description, githubLink, specifications])
            if (res0.rowCount > 0){
                let idR = res0.rows[0].id; // projectId btw
                try{
                    let res2: pg.QueryResult = await pool.query(queries.project.addProjectMembersQ, [idR, userId, 'leader'])
                    if (res2.rowCount > 0){
                        res.status(200).json({data:res2.rows, message: "sucesfully added", status:"success"});
                    }else{
                        res.status(403).json({data: null, message: "cant create project, please try again", status:"success"})
                    }
                }catch(e){
                    res.status(500).json({error: e});
                }
            }
        }else{
            let res2: pg.QueryResult;
            let res0: pg.QueryResult = await pool.query(queries.project.addProjectsQ, [name, description, githubLink, specifications])
            if (res0.rowCount > 0){
                let idR = res0.rows[0].id;
                try{
                    res2 = await pool.query(queries.project.addProjectMembersQ, [idR, userId, 'leader'])
                }catch(e){
                }
                for (let i = 0; i<members.length;i++){
                    try{
                        let resultMembers: pg.QueryResult = await pool.query(queries.project.addProjectMembersByDisplayName, [idR, members[i], 'member'])
                    }catch(e){
                        console.log(e + "BLACKBLACKBALCKBLACK")
                        
                    }
                }
                res.status(200).json({result: res2});
            }
        }
    }catch(e){
        res.status(402).json({error: e})
    }
})


router.post('/addProjectMemberByDisplayName', verifySessionToken, async (req,res)=> {
    const {displayName, projectId} = req.body
    try{
        let result = await pool.query(queries.project.addProjectMembersByDisplayName, [projectId, displayName, "member"])
        if (result.rowCount > 0) {
            res.status(200).json({data:result.rows, message: "added a project member", status:"success"});
        }else{
            res.status(200).json({data:result.rows, message: "did not add a project member but was successful", status:"success"});
        }
    }catch(e){
        console.log(e)
        res.status(403).json({error: "cannot add project member due to errors"})
    }

})

router.patch(`/updateProjectMemberRole/:projectId`, async (req,res)=> {
    const {projectId} = req.params
    const {role, memberId} = req.body

    try{
        let result = await pool.query(queries.project.updateProjectMemberRole, [role, memberId, projectId])
        if (result.rowCount > 0) {
            res.status(200).json({data:result.rows, message: "updated a project role", status:"success"});
        }else{
            res.status(200).json({data:result.rows, message: "did not update a project role but was successful", status:"success"});
        }
    }catch(e){
        console.log(e)
        res.status(403).json({error: "cannot update project member role due to errors"})
    }
})
router.post('/verifyProjectAccess', verifySessionToken, async (req,res)=> {
    const {userId} = req

    const {projectId} = req.body

    try{
        let result = await pool.query(queries.project.getProjectMemberByIdQ, [projectId, userId]);
        if(result.rowCount > 0){
            res.status(200).json({data:result.rows[0], message: "exists", status:"success"});
        }else{
            res.status(200).json({data:null, message: "cannot find member in project", status:"success"})
        }
    }catch(e){
        console.log(e);
        res.status(403).json({error: e})
    }
})




router.patch('/patchProject/:projectId', verifySessionToken, async (req,res) => {
    const {userId} = req
    const {githubLink, name, specifications, description} = req.body
    const {projectId} = req.params

    console.log(githubLink, name, specifications, description)


    let values : any = []
    let conditions : any = []
    let whereConditions : any = []

    if (githubLink){
        conditions.push(`github_link = $${values.length+1}`)
        values.push(githubLink)
    }
    if(name){
        conditions.push(`name = $${values.length+1}`)
        values.push(name)
    }
    if(specifications){
        conditions.push(`specifications = $${values.length+1}`)
        values.push(specifications)
    }
    if(description){
        conditions.push(`description = $${values.length+1}`)
        values.push(description)
    }

    whereConditions.push(`id = $${values.length+1}`);
    values.push(projectId)


    
    let newQuery: string = `
        UPDATE projects 
        SET ${conditions.join(', ')}
        WHERE ${whereConditions.join(` AND `)}
        RETURNING *;
    `



    try{
        let result = await pool.query(newQuery, values)
        if (result.rowCount! > 0){
            res.status(200).json({status:"success", message: "succesfully updated projects"})
        }else{
            console.log("NIGP")
            res.status(200).json({status:"success", message: "did not update projects "})
        }
    }catch(e){
        res.status(500).json({status:"fail", message: "did not create update projects due to server errors"})
        console.log(e)
    }
})






export {router}