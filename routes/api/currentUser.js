const express = require('express');
// const {User} = require("../../models/user");
const {auth} = require("../../middlewares")

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
})

module.exports = router