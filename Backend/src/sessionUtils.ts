
import express, {Request, Response, NextFunction} from 'express'


const router = express()


const verifySessionToken = (req: Request, res: Response, next: NextFunction ) => {
    const {userSessionObj} = req.session
    console.log(userSessionObj);
    

    if (userSessionObj.userId && userSessionObj.userDisplayName != ""){
        res.status(200).json({status: "validRequest"})
    }else{
        res.status(401).json({error: "UnAuthorized User"})
    }
    
}





export default router