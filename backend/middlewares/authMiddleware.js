const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next)=>{
    const token = req.cookies.authToken;

    if(!token){
        res.statu(401).json({
            message: "Unauthorised/Token not found."
        })
    }

    try{
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        req.user = verified;
        next();
    }catch(error){
        res.status(401).json({
            message: error.message
        })
    }
}
module.exports = {authMiddleware};