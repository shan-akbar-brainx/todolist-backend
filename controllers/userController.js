import UserModel from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

class UserController{
    static userRegisteration = async (req, res) => {
        const {name, email, password, password_confirmation, tc } = req.body
        const user = await UserModel.findOne({email:email})
        if(user){
            res.status(201).send({"status":"failed", "message":"Email already exists"});
        }else{
            if(name && email && password && password_confirmation && tc){
                if(password == password_confirmation){
                    try{
                        const salt = await bcrypt.genSalt(10)
                        const hashPassword = await bcrypt.hash(password, salt)
                        const doc = new UserModel({
                            name:name,
                            email: email,
                            password:hashPassword,
                            tc:tc
                        })
                        await doc.save()
                        const saved_user = await UserModel.findOne({ email: email});

                        // Generate JWT Token
                        const token = jwt.sign({ userID: saved_user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '5d'});
                        res.send({"status": "success", "success":"Registeration Successfull", "token": token, "name": name, "email": email, "userid": saved_user._id });
                    }catch(error){
                        console.log(error)
                        res.send({"status": "failed", "message":"Unable to Register"})
                    }
                }else{
                    res.send({"status": "failed", "message":"Password and Confirm Password Does not match"});
                }
            }else{
                res.send({"status": "failed", "message":"All Fields are required"});
            }
        }

    }

    static userLogin = async(req, res) => {
        try{
            const{email, password} = req.body
            if(email && password){
                const user = await UserModel.findOne({email: email})
                if(user != null){
                    const isMatch = await bcrypt.compare(password, user.password)
                    if(user.email === email && isMatch){
                        const token = jwt.sign({ userID: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '5d'});
                        res.send({"status": "success", "message":"Login Successfull", "token":token, "name": user.name, "email": user.email, "userid": user._id });
                    }else{
                        res.send({"status": "failed", "message":"Email Or Password is not valid"});
                    }
                }else{
                        res.send({"status": "failed", "message":"Not Registered User"});
                }
            }else{
                res.send({"status": "failed", "message":"All Fields are required"});
            }
        }catch(error){
                console.log(error);
        }
    }

    static changeUserPassword  = async(req, res) => {
        const { password, password_confirmation} = req.body
        if(password && password_confirmation){
            if(password !== password_confirmation){
                res.send({"status": "failed", "message":"New password and confirm new password does not match"});
            }else{
                const salt = await bcrypt.genSalt(10)
                const newHashPassword = await bcrypt.hash(password, salt);
                await UserModel.findByIdAndUpdate(req.user._id, { $set: { password: newHashPassword } })
                res.send({ "status": "success", "message": "Password changed succesfully" })
            }
        }else{
            res.send({"status": "failed", "message":"All Fields are required"});
        }
    }

    static loggedUser  = async(req, res) => {
        res.send({"user": req.user})
    }

} 

export default UserController