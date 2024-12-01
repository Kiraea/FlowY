
import express, {Request, Response, NextFunction} from 'express'




const verifySessionToken = (req: Request, res: Response, next: NextFunction ) => {
    
    const {userSessionObj} = req.session || null
    console.log("session utils" + userSessionObj);
    

    if (userSessionObj !== null && userSessionObj.userId){
        req.userId =  userSessionObj.userId
        console.log("going next")
        return next()
    }else{
        console.log("did not go next");
        res.status(401).json({error: "UnAuthorized User"})
    }
}




export {verifySessionToken}