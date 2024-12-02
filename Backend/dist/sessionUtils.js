const verifySessionToken = (req, res, next) => {
    const { userSessionObj } = req.session || null;
    console.log("VSTs", new Date());
    if (userSessionObj !== null && userSessionObj.userId) {
        req.userId = userSessionObj.userId;
        return next();
    }
    else {
        res.status(401).json({ error: "UnAuthorized User" });
    }
};
export { verifySessionToken };
//# sourceMappingURL=sessionUtils.js.map