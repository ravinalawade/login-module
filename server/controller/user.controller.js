const mongoose = require('mongoose');
const request =require('request');
const session =require('express-session')
// var nodemailer = require('nodemailer');
var async=require('async');
// var crypto =require('crypto');
// const passport = require('passport');
// const _ = require('lodash');

const User = mongoose.model('User');
const Visit = mongoose.model('Visit');

// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'ravinalawade5@gmail.com',
//       pass: 'Acbl@1234'
//     }
//   });

module.exports.register = (req, res, next) => {
    var sn=req.session
    var user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.phone_no = req.body.phone_no;
    user.age = req.body.age;
    user.country = req.body.country;
    user.city = req.body.city;
    user.profession = req.body.profession;
    sn.name=user.name
    sn.phone_no=user.phone_no
    user.save((err, doc) => {
        if (!err)
            res.send(doc);
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else
                return next(err);
        }

    });
}

module.exports.login=(req,res,next)=>{
    // var email=req.body.email;
    // var phone_no=req.body.phone_no;
    // User.findOne({phone_no:phone_no},
    //     (err,user)=>{
    //         if (!user)
    //             return res.status(200).json({ status: false });
    //         else
    //             return res.status(200).json({ status: true, user : user });
    //     }
    // );
    var flag=1
    async.waterfall([
        // function(done) {
        //   User.findOne({
        //     phone_no: req.body.phone_no
        //   }).exec(function(err, user) {
        //     if (user) {
        //       flag=1
        //       done(err, user);
        //     } else {
        //       console.log(req.body.phone_no)
        //       flag=0
        //       done(err,user)
        //     }
        //   });
        // },
        function(done) {
              // console.log(user)
            var options = {
              'method': 'POST',
              'url': 'https://api.ringcaptcha.com/ihaqepa2e6u1egyjyqad/code/sms',
              'headers': {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              form: {
                'phone': req.body.phone_no,
                'api_key': 'b567f79b865e052c355516c435a3d82804f6ee62'
              }
            };
            request(options, function (error, response) {
              if (error) throw new Error(error);
              console.log(response.body,"pass")
              done(null,response.body)    //pass the response
              // res=JSON.parse(response.body)
            });
          
    },
    function(response,done){
      // console.log(response,2)
      var ans=JSON.parse(response)
      done(null,ans) //pass json object
    },
    function(ans,done){
      console.log(ans)
      if (ans.status!="SUCCESS")
      {
        flag=0
      }
      // console.log(ans,3)
      done(null)
    },
    // function(done) {
    //   if(flag!=2){
    //     User.findOne({
    //       phone_no: req.body.phone_no
    //     }).exec(function(err, user) {
    //       if (user) {
    //         flag=1
    //         done(null);
    //       } else {
    //         console.log(req.body.phone_no)
    //         flag=0
    //         done(null)
    //       }
    //     });
    //   }
    //   else
    //   done(null)
    // }
      ], function() {
        console.log("return")
        return res.status(200).json({status:flag})
      })
};

module.exports.otpverify=(req,res,next)=>{
  var ssn=req.session;
  var user_response=1
  console.log("in function",req.body.phone_no)
  async.waterfall([
    function(done) {
      User.findOne({
        phone_no: req.body.phone_no
      }).exec(function(err, user) {
        if (user) {
          done(err, user);
        } else {
          user_response=0
          done(err,user)
        }
      });
    },
    function(user, done) {
      if(user_response){
        console.log("otp verifying")
        var options = {
          'method': 'POST',
          'url': 'https://api.ringcaptcha.com/ihaqepa2e6u1egyjyqad/verify',
          'headers': {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          form: {
            'phone': req.body.phone_no,
            'api_key': 'b567f79b865e052c355516c435a3d82804f6ee62',
            'code': req.body.code
          }
        };
        var flag=request(options, function (error, response) {
          if (error) throw new Error(error);
          var ans=response.body
          console.log(response.body);
          done(error,ans,user)
        });
      }
      else{
        console.log("user not found")
        done(null,user_response,0)
      }
      // console.log(user,ans)
      // done(ans)
    },
    function(ans,user,done){
      console.log("parse")
      ans=JSON.parse(ans)
      if (ans){
        if(ans.status=="SUCCESS"){
          user_response=user
          ssn.phone_no=user.phone_no
          ssn.name=user.name
          console.log(ssn)
        }
        else{
          user_response=0
        }
      }
      done(null)
    }
  ], function(err) {
    return res.status(422).json({status:user_response});
  })
}

module.exports.visit = (req, res, next) => {
  var ssn=req.session
  console.log(ssn)
  var visit = new Visit();
  visit.phone_no = ssn.phone_no
  visit.name = ssn.name
  visit.booth_id = req.body.booth_id;
  visit.time_spent = req.body.time_spent;
  visit.pic_clicks = req.body.pic_clicks;
  visit.vid_clicks = req.body.vid_clicks;
  visit.sim_clicks = req.body.sim_clicks;
  visit.save((err, doc) => {
      if (!err)
          res.send(doc);
      else {
          if (err.code == 11000)
              res.status(422).send(['Error found.']);
          else
              return next(err);
      }

  });
}

//Email
// module.exports.email_userid=(req,res,next)=>{
//     async.waterfall([
//         function(done) {
//           User.findOne({
//             email: req.body.email
//           }).exec(function(err, user) {
//             if (user) {
//               done(err, user);
//             } else {
//               done('User not found.');
//             }
//           });
//         },
//         function(user, done) {
//           // create the random token
//           crypto.randomBytes(20, function(err, buffer) {
//             var token = buffer.toString('hex');
//             done(err, user, token);
//           });
//         },
//         function(user, token, done) {
//           User.findByIdAndUpdate({ _id: user._id }, { reset_password_token: token, reset_password_expires: Date.now() + 86400000 }, { upsert: true, new: true }).exec(function(err, new_user) {
//             done(err, token, new_user);
//           });
//         },
//         function(token, user, done) {
//           var data = {
//             to: user.email,
//             from: "ravinalawade5@gmail.com",
//             // template: 'forgot-password-email',
//             subject: 'Password help has arrived!',
//             html:"Hello"+user.fullName.split(' ')[0]+"</br>Your password link is:"+'http://localhost:3000/api/reset_password?token=' + token,
//             // context: {
//             //   url: 'http://localhost:3000/auth/reset_password?token=' + token,
//             //   name: user.fullName.split(' ')[0]
//             // }
//           };
    
//           transporter.sendMail(data, function(err) {
//             if (!err) {
//               return res.json({ message: 'Kindly check your email for further instructions' });
//             } else {
//               return done(err);
//             }
//           });
//         }
//       ], function(err) {
//         return res.status(422).json({ message: err });
//       });
//     };

// module.exports.updatepassword=(req,res,next)=>{
//     console.log(req.query.token,req.body)
//     User.findOne({
//         reset_password_token: req.query.token,
//         reset_password_expires: {
//           $gt: Date.now()
//         }
//       }).exec(function(err, user) {
//         if (!err && user) {
//           if (req.body.newPassword === req.body.verifyPassword) {
//             user.password = req.body.newPassword;
//             user.reset_password_token = undefined;
//             user.reset_password_expires = undefined;
//             user.save(function(err) {
//               if (err) {
//                   console.log("in if")
//                 return req.status(422).send({
//                   message: err
//                 });
//               } else {
//                 console.log("in else")
//                 var data = {
//                   to: user.email,
//                   from: 'ravinalawade5@gmail.com',
//                 //   template: 'reset-password-email',
//                   subject: 'Password Reset Confirmation',
//                   html:'Your password has been changed'
//                 //   context: {
//                 //     name: user.fullName.split(' ')[0]
//                 //   }
//                 };
    
//                 transporter.sendMail(data, function(err) {
//                   if (!err) {
//                     console.log("in email if")
//                     return res.json({ message: 'Password reset' });
//                   } else {
//                     return done(err);
//                   }
//                 });
//               }
//             });
//           } else {
//             return res.status(422).send({
//               message: 'Passwords do not match'
//             });
//           }
//         } else {
//           return res.status(400).send({
//             message: 'Password reset token is invalid or has expired.'
//           });
//         }
//       });
// }
