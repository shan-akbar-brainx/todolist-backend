import jwt from 'jsonwebtoken'
import UserModel from "../models/User.js"
var checkUserAuth = async(req, res, next)=>{
    let token
    const {contentType, authorization} = req.headers
    if(authorization && authorization.startsWith('Bearer')){
        try{
            token = authorization.split(' ')[1]
            // Verify token code
            const {userID} = jwt.verify(token, process.env.JWT_SECRET_KEY)
            // Get User From the Token
            req.user = await UserModel.findById(userID).select('-password');
            next()
        }catch(err){
            console.log(err);
            res.status(401).send({"status":"failed", "message":"Unathorized User"})
        }
        if(!token){
            res.status(401).send({"status":"failed", "message":"Unathorized User, No Token"})
        }
    }
}
export default checkUserAuth