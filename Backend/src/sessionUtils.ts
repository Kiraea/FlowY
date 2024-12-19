
import express, {Request, Response, NextFunction} from 'express'




const verifySessionToken = (req: Request, res: Response, next: NextFunction ) => {
    
    const {userSessionObj} = req.session || null
    if (userSessionObj !== null && userSessionObj.userId){
        req.userId =  userSessionObj.userId
        return next()
    }else{
        res.status(401).json({error: "UnAuthorized User"})
    }
}




export {verifySessionToken}