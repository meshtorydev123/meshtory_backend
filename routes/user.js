const express = require("express");
const User = require("../models/users.model");
const router = express.Router();
const config = require("../config");
const jwt = require("jsonwebtoken");
const middleware = require("../middleware");
const bcrypt = require('bcrypt');
const saltRounds = 10;


router.route("/:username").get(middleware.checkToken, (req, res) => {
    User.findOne({
            username: req.params.username
        },
        (err, result) => {
            if (err) return res.status(500).json({
                msg: err
            });
            res.json({
                data: result,
                username: req.params.username
            });
        });
});

router.route("/login").post((req, res) => {
    User.findOne({
            username: req.body.username
        },
        (err, result) => {
            if (err) return res.status(500).json({
                msg: err
            });
            if (result === null) {
                return res.status(403).json("Username incorrect");
            }
            if (result.password === req.body.password) {
                let token = jwt.sign({
                    username: req.body.username
                }, config.key, {
                    expiresIn: "24h"
                });
                res.json({token :token,
                msg:"success"});
            } else {
                res.status(403).json("Password is incorrect");
            }
        });
});

router.route("/register").post((req, res) => {
    console.log("inside the register");
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const user = new User({
            name: req.body.name,
            username: req.body.username,
            password: hash,
            email: req.body.email,
        });
        user
            .save()
            .then(() => {
                console.log("user registered");
                res.status(200).json("ok");
            })
            .catch((err) => {
                res.status(403).json({
                    msg: err
                });
            });
    });
    

});

router.route("/update/:username").patch(middleware.checkToken, (req, res) => {
    User.findOneAndUpdate({
            username: req.params.username
        }, {
            $set: {
                password: req.body.password
            }
        },
        (err, result) => {
            if (err) return res.status(500).json({
                msg: err
            });
            const msg = {
                msg: "password successfully updated",
                username: req.params.username,
            };
            return res.json(msg);
        }
    )
});

router.route("/delete/:username").delete(middleware.checkToken, (req, res) => {
    User.findOneAndDelete({
            username: req.params.username
        },
        (err, result) => {
            if (err) return res.status(500).json({
                msg: err
            });
            const msg = {
                msg: "user deleted",
                username: req.params.username,
            };
            return res.json(msg);
        }
    )
});
module.exports = router;