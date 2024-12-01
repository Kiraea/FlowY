import express from 'express';

const router = express()
import {pool} from '../index.js'
import {queries} from '../queries/query.js'
import argon2 from 'argon2';

import {verifySessionToken} from '../sessionUtils.js'
import {UserType} from '../types/types.js'


const checkIfValid = async (username: string) : Promise<UserType> | null => {
    let found = await pool.query(queries.user.checkIfExistQ, [username])
    return found.rows[0] || null;
}
router.get('/getUsers', async (req,res)=>{
    let result = await pool.query(queries.user.getUsersQ);
    res.json({users: result.rows});
})

router.get('/getUser', (req,res)=>{
})

router.get(`/getUserDisplayName`, verifySessionToken, async (req,res)=>{
    const {userId} = req;
    if(userId === undefined){
        res.status(403).json({error: "undefined session id"});
    }else{
        try{
            let result = await pool.query(queries.user.getDisplayName, [userId]);
            if (result.rowCount > 0){
                console.log("dsad" + result.rows[0].display_name);
                res.status(200).json({displayName: result.rows[0].display_name})
            }
        }catch(e){
            console.log(e)
            res.status(500).json({error: "failed due to: " + e})
        }
    }


})

router.post('/login', async (req,res)=>{
    const {username, password} = req.body
    console.log(username, password)
    const user: UserType = await checkIfValid(username)
    if(user){

        if (await argon2.verify(user.password, password)){
            req.session.userSessionObj= {userId: user.id}


            res.json({username: user.username})
        }else{
            res.status(401).json({error: "wrong password"})
        }
    }else{
        res.status(401).json({error: "invalid, please check your username or password"})
    }
})

router.post('/register', async (req,res)=>{
        console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
    const {username, password, display_name} = req.body

    console.log(username, password, display_name);
    let newUser: string;
    let user: UserType = await checkIfValid(username)
    if (!user){
        const hashed_password =  await argon2.hash(password);
        let result = await pool.query(queries.user.registerQ, [username, hashed_password, display_name])
        if (result.rows.length > 0 ){
            newUser = result.rows[0].username;
            res.json({newUser});
    }else{
            console.log("username already exist")
        }
    }
})


router.get('/verifySessionToken', verifySessionToken, async(req,res) => {
    const {userId} = req;
    console.log("backend verifysessiontoken" + userId)
    if(userId){
        console.log("backend verifysessiontoken" + userId)
        res.status(200).json({result: true})
    }else{
        console.log("backend verifysessiontoken" + userId)
        res.status(401).json({result: false})
    } 
})



export {router}

