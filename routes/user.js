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

// UPDATE PROFILE DATA 
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
router.route("/update/name").patch( middleware.checkToken,  (req, res) => {
     User.findOneAndUpdate(
        {_id: mongoose.Types.ObjectId(req.decoded.uid)}, 
        {
            $set: {
             name: req.body.name,
        }
    },
    { new: true },
    (err, user) => {
        if (err) return res.status(500).json({
            msg: err
        });
        const response = {
            msg: "name updated successfully",
            data: user ,
        };
        return res.status(200).send(response);
    }
)
    
});
router.route("/update/gender").patch( middleware.checkToken,  (req, res) => {
    User.findOneAndUpdate(
       {_id: mongoose.Types.ObjectId(req.decoded.uid)}, 
       {
           $set: {
            gender: req.body.gender,
       }
   },
   { new: true },
   (err, user) => {
       if (err) return res.status(500).json({
           msg: err
       });
       const response = {
           msg: "gender updated successfully",
           data: user ,
       };
       return res.status(200).send(response);
   }
)
   
});
router.route("/update/phone").patch( middleware.checkToken,  (req, res) => {
    User.findOneAndUpdate(
       {_id: mongoose.Types.ObjectId(req.decoded.uid)}, 
       {
           $set: {
            phone: req.body.phone,
       }
   },
   { new: true },
   (err, user) => {
       if (err) return res.status(500).json({
           msg: err
       });
       const response = {
           msg: "phone updated successfully",
           data: user ,
       };
       return res.status(200).send(response);
   }
)
   
});
router.route("/update/email").patch( middleware.checkToken,  (req, res) => {
    User.findOneAndUpdate(
       {_id: mongoose.Types.ObjectId(req.decoded.uid)}, 
       {
           $set: {
            email: req.body.email,
       }
   },
   { new: true },
   (err, user) => {
       if (err) return res.status(500).json({
           msg: err
       });
       const response = {
           msg: "email updated successfully",
           data: user ,
       };
       return res.status(200).send(response);
   }
)
   
});
router.route("/update/dob").patch( middleware.checkToken,  (req, res) => {
    User.findOneAndUpdate(
       {_id: mongoose.Types.ObjectId(req.decoded.uid)}, 
       {
           $set: {
            dob: req.body.dob,
       }
   },
   { new: true },
   (err, user) => {
       if (err) return res.status(500).json({
           msg: err
       });
       const response = {
           msg: "dob updated successfully",
           data: user ,
       };
       return res.status(200).send(response);
   }
)
   
});
router.route("/update/bio").patch( middleware.checkToken,  (req, res) => {
     User.findOneAndUpdate(
        {_id: mongoose.Types.ObjectId(req.decoded.uid)}, 
        {
            $set: {
             bio: req.body.bio,
        }
    },
    { new: true },
    (err, user) => {
        if (err) return res.status(500).json({
            msg: err
        });
        const response = {
            msg: "bio updated successfully",
            data: user ,
        };
        return res.status(200).send(response);
    }
)
    
});
router.route("/update/website").patch( middleware.checkToken,  (req, res) => {
     User.findOneAndUpdate(
        {_id: mongoose.Types.ObjectId(req.decoded.uid)}, 
        {
            $set: {
             website: req.body.website,
        }
    },
    { new: true },
    (err, user) => {
        if (err) return res.status(500).json({
            msg: err
        });
        const response = {
            msg: "website updated successfully",
            data: user ,
        };
        return res.status(200).send(response);
    }
)
    
});
router.route("/update/email").patch( middleware.checkToken,  (req, res) => {
    User.findOneAndUpdate(
       {_id: mongoose.Types.ObjectId(req.decoded.uid)}, 
       {
           $set: {
            email: req.body.email,
       }
   },
   { new: true },
   (err, user) => {
       if (err) return res.status(500).json({
           msg: err
       });
       const response = {
           msg: "email updated successfully",
           data: user ,
       };
       return res.status(200).send(response);
   }
)
   
});
// UPDATE PROFILE DATA 

// PHONE OTP
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
// PHONE OTP

//AUTHENTICATION
router.route("/loginwithusername").post((req, res) => {
    User.findOne({
            username: req.body.username
        },
        (err, result) => {
            if (err) return res.status(500).json({
                msg: err
            });
            
            if (result === null) {
                return res.status(403).json("Incorrect Username");
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
                    res.status(403).json("Incorrect password");
                }
                
            });
            
        });
});
router.route("/register").post((req, res) => {
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
                res.status(200).json("User register successful");
            })
            .catch((err) => {
                res.status(403).json({
                    msg: err
                });
            });
    });
    

});
router.route("/update/forgottenpasswordwithusername").patch(middleware.checkToken, (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, function(errb, hash) {
        User.findOneAndUpdate({
            username: req.body.username
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
                username: req.body.username,
            };
            return res.json(msg);
        }
    )
    });
    
});
router.route("/update/changepassword/").patch(middleware.checkToken, (req, res) => {
    User.findOne({_id: mongoose.Types.ObjectId(req.decoded.uid)}, 
    (err, result) => {
        if (err) return res.status(500).json({
            msg: err
        });
        
        bcrypt.compare(req.body.oldpassword, result.password, function(errb, resultb) {
            if ( resultb=== true) {
                let token = jwt.sign({
                    uid: result._id
                }, config.key, {
                    expiresIn: "24h"
                });
                


                bcrypt.hash(req.body.newpassword, saltRounds, function(errb, hash) {
                    User.updateOne( {
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
                            data: result,
                        };
                        return res.json(msg);
                    }
                )
                });
            




            } else {
                res.status(403).json("Your old password was entered incorrectly. Please enter it again");
            }
            
        });
        
    });
    
    
});
//AUTHENTICATION

//DEACTIVATE ACCOUNT
router.route("/delete").delete(middleware.checkToken, (req, res) => {
    User.findOneAndDelete({_id: mongoose.Types.ObjectId(req.decoded.uid)}, 
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
//DEACTIVATE ACCOUNT




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





module.exports = router;