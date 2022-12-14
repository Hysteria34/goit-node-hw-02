const express = require('express');
const {Conflict,Unauthorized} = require("http-errors");
const bcrypt =require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const {sendEmail} = require("../../helpers");


const {User} = require("../../models/user");
const { auth } = require('../../middlewares');
const {nanoid} = ("nanoid")

const router = express.Router();

const {SECRET_KEY} = process.env;
router.post('/signup', async (req, res) => {
        const {name, email, password} = req.body;
        const user = await User.findOne({email});
        if(user){
            throw new Conflict("Email in use")
        }

        const verificationToken = nanoid();
        const avatarURL = gravatar.url(email);
        
        const hashPassword=bcrypt.hashSync(password,bcrypt.genSaltSync(10))

        const mail = {
            to: email,
            subject: "Подтверждения email",
            html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Подтвердить email</a>`
        };
        
        await sendEmail(mail);

        const result = await User.create({name, email, password:hashPassword,avatarURL,verificationToken});

        res.status(201).json({
            status: "success",
            code: 201,
            data: {
              result
            }
        });
});
router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    const passCompare = bcrypt.compareSync(password,user.password)
    if(!user || !passCompare || !user.verify){
        throw new Unauthorized("Email or password is wrong")
    }
   
    const payload = {
        id: user._id
    }
    const token=jwt.sign(payload,SECRET_KEY, {expiresIn:"1h"});
    await User.findByIdAndUpdate(user._id, {token});
    res.json({
        status: "success",
        code: 200,
        data: {
           token
        }
    })
});
router.post('/logout', auth, async (req, res) => {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token:null});
    res.status(204).json();
});
module.exports = router