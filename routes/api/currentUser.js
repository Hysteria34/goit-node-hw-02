const express = require('express');
const {User} = require("../../models/user");
const {NotFound} = require("http-errors");
const path = require("path");
const fs = require("fs/promises");

const {auth,upload} = require("../../middlewares")

const avatarsDir = path.join("public", "avatars");

const router = express.Router();

router.get('/current',auth, async (req, res) => {
    console.log()
    const {name, email} = req.user;
    res.json({
        status: "success",
        code: 200,
        data: {
            user: {
                name,
                email
            }

        }
    })
});
router.patch('/avatars',auth, upload.single("avatar"), async (req, res) => {
        const {path: tempUpload, originalname} = req.file;
        const {_id: id} = req.user;
        const imageName =  `${id}_${originalname}`;
        try {
            const resultUpload = path.join(avatarsDir, imageName);
            await fs.rename(tempUpload, resultUpload);
            const avatarURL = path.join("public", "avatars", imageName);
            await User.findByIdAndUpdate(req.user._id, {avatarURL});
            res.json({avatarURL});
        } catch (error) {
            await fs.unlink(tempUpload);
            throw error;
        }
});
router.get("/verify/:verificationToken", async (req, res) => {
    const {verificationToken} = req.params;
    const user = await User.findOne({verificationToken});
    if(!user){
        throw NotFound();
    }
    await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: null});

    res.json({
        message: "Verification successful"
    })
});
module.exports = router