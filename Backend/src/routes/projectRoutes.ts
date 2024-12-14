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
    const {userId} = req || null;
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

router.get('/getProjectMembersById', async(req,res)=>{
    const {projectId} = req.query
    console.log(projectId + "Dsadas");
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
    console.log(members +"all the members")


    console.log(name, description, link, specifications, members)

    let hasMembers = Array.isArray(members) && members.length > 0;
    const githubLink = link === '' ? null : link
    console.log(hasMembers, "hasMembersValue")
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
                    console.log("res2:", res2)
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
            console.log("else statement");
            let res2: pg.QueryResult;
            let res0: pg.QueryResult = await pool.query(queries.project.addProjectsQ, [name, description, githubLink, specifications])
            if (res0.rowCount > 0){
                let idR = res0.rows[0].id;
                try{
                    res2 = await pool.query(queries.project.addProjectMembersQ, [idR, userId, 'leader'])
                }catch(e){
                    console.log(e + "whitewhitewhite")
                }
                for (let i = 0; i<members.length;i++){
                    try{
                        console.log("i value =" + members[i]);
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
    console.log(role, memberId + "role" + "memberId");

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

    console.log('userId');
    const {projectId} = req.body

    console.log(projectId + "projectid")
    console.log(userId+ "userId")
    try{
        let result = await pool.query(queries.project.getProjectMemberByIdQ, [projectId, userId]);
        if(result.rowCount > 0){
            res.status(200).json({data:result.rows[0], message: "exists", status:"success"});
        }else{
            console.log(result.rows + "dkwoadkawodkwao");
            res.status(200).json({data:null, message: "cannot find member in project", status:"success"})
        }
    }catch(e){
        console.log(e);
        res.status(403).json({error: e})
    }
})

router.post(`/`)

export {router}