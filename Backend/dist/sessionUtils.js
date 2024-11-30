import express from 'express';
const router = express();
const verifySessionToken = (req, res, next) => {
    const { userSessionObj } = req.session;
    console.log(userSessionObj);
    if (userSessionObj.userId && userSessionObj.userDisplayName != "") {
        res.status(200).json({ status: "validRequest" });
    }
    else {
        res.status(401).json({ error: "UnAuthorized User" });
    }
};
export default router;
//# sourceMappingURL=sessionUtils.js.map