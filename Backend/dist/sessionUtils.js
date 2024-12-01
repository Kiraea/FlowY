const verifySessionToken = (req, res, next) => {
    const { userSessionObj } = req.session || null;
    console.log("session utils" + userSessionObj);
    if (userSessionObj !== null && userSessionObj.userId) {
        req.userId = userSessionObj.userId;
        console.log("going next");
        return next();
    }
    else {
        console.log("did not go next");
        res.status(401).json({ error: "UnAuthorized User" });
    }
};
export { verifySessionToken };
//# sourceMappingURL=sessionUtils.js.map