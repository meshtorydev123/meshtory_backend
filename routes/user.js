const express = require("express");
const User = require("../models/users.model");
const router = express.Router();
const mongoose = require("mongoose");
const config = require("../config");
const jwt = require("jsonwebtoken");
const middleware = require("../middleware");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const client = require("twilio")(config.accountSID,config.authToken);
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { s3_bucket_region } = require("../config");
const s3 = new aws.S3({
     accessKeyId : config.s3_access_key,
     secretAccessKey : config.s3_secret_access_key,
     region : s3_bucket_region,  
});
const upload = multer({
    storage: multerS3({
        s3,
        bucket:config.s3_bucket_name,
        metadata: function (req, file, cb ){
            cb(null,{fieldName:file.fieldname});

        },
        key : function (req, file, cb ){
            cb(null,`profilephoto-${req.decoded.uid}.jpeg`); 

        },
    }),

});

router.route("/update/profilephoto").patch( middleware.checkToken, upload.single("img"), async (req, res) => {
    await User.findOneAndUpdate(
        {_id: mongoose.Types.ObjectId(req.decoded.uid)}, 
        {
            $set: {
             profilephoto: req.file.location,
        }
    },
    { new: true },
    (err, user) => {
        if (err) return res.status(500).send(err);
        const response = {
            msg: "profilephoto updated successfully",
            data: user ,
        };
        return res.status(200).send(response);
    }
)
    
});
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
router.route("/sendsms").post((req, res) => {
    client
         .verify
         .services(config.serviceID)
         .verifications
         .create({
            to : req.body.phone,
            channel : "sms"

         }
         )
         .then((data)=>{
             res.status(200).send(data)
         });
         
    
});
router.route("/verifysms").post((req, res) => {
    client
         .verify
         .services(config.serviceID)
         .verificationChecks
         .create({
            to : req.body.phone,
            code : req.body.code

         }
         )
         .then((data)=>{
             res.status(200).send(data)
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
            bcrypt.compare(req.body.password, result.password, function(errb, resultb) {
                if ( resultb=== true) {
                    let token = jwt.sign({
                        uid: result._id
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
});
router.route("/register").post((req, res) => {
    console.log("inside the register");
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const user = new User({
            name: req.body.name,
            username: req.body.username,
            password: hash,
            phone: req.body.phone,
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
    bcrypt.hash(req.body.password, saltRounds, function(errb, hash) {
        User.findOneAndUpdate({
            username: req.params.username
        }, {
            $set: {
                
                password: hash,
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