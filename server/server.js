/************************************************************ @fileoverview<pre>
	Name:           server.js
	Author:         Leon Liang
	Created:        6/15/2016
	For Version:		1.0x
	Modifications:
	Summary:
          Server side main javascript. Contains all get and post

</pre>*************************************************************************/
//******************************* Configuration ********************************
//Define Modules Requirement Here

var express = require("express");
var session = require('express-session');
var app = express();
var bodyParser = require("body-parser");
//Calls on storage and applicatioon level modules
var events = require("./Events.js");
var storage = require("./storage.js");
var application = require("./controllers/users.controller.js");
var mongoose = require('mongoose');
var User = require('./models/user.model.js');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
//******************************* Global Variables *****************************
var db_url = 'mongodb://localhost/evacadb';
var sess;
var email;
var User1;

var planners2 =
   {location:String, events:[null]};

var server_code = "";
//******************************************************************************

/*********************************Websockets and Middleware Routing******************************/

app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
* Parses the text as JSON and exposes the resulting object on req.body.
*/
app.use(bodyParser.json());

app.use(express.static('www'));

app.use(function(req, res,next) {
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
     next();
});

app.use(session({secret : 'secret'}));

app.post('/newEmail', function(req, res) {
    sess = req.session;
    User1.updateUserEmail(req.body.newEmail);
});

app.post('/newPassword', function(req, res) {
    sess = req.session;
    User1.updateUserPass(req.body.newPass);
});

app.post('/deleteAccount', function(req, res) {
    sess = req.session;
    User1.del_Account();
});

app.get('/main', function(req, res) {
	sess = req.session;
     console.log("MAIN :: "+email);
     User1.load(email).then(dbres => res.send(dbres.planner));
});

app.get('/events', function(req, res) {
	sess = req.session;
     User1.load(email).then(user =>

		res.send(user.planner.id(req.query.plannerId).events));
});

app.post('/planner', function(req,res){

     sess=req.session;
     sess.location = req.body.location;
     sess.budget=req.body.budget;
     sess.Leaving=req.body.Leaving;
     sess.returningdate=req.body.returningdate;
     sess.idealvacation=req.body.idealvacation;
     var vacaType="";

     //Turn request into a string to be read and reindexed
     var JvacaType = JSON.stringify(req.body.idealvacation);
     if (JvacaType === undefined) {
         vacaType = 'active,arts,food,nightlife,';
     } else {
         if (JvacaType.indexOf('arts') >= 0) {
             vacaType += 'arts,';
         }
         if (JvacaType.indexOf('food') >= 0) {
             vacaType += 'food,';
         }
         if (JvacaType.indexOf('nightlife') >= 0) {
             vacaType += 'nightlife,'
         }
         if (JvacaType.indexOf('active') >= 0) {
             vacaType += 'active,'
         }
     }
     console.log("vacation type = "+ vacaType.substring(0,vacaType.length-1));

     //Calculate number of days the user inputted
     var num_of_days = Math.abs(Math.floor((Date.parse(sess.Leaving)-Date.parse(req.body.returningdate))/86400000)) + 1;
     console.log("Days = "+num_of_days);
     var Event1 = new events(num_of_days,req.body.budget,req.body.location, vacaType.substring(0,vacaType.length-1));

     //Creates a planner based on the preferences and saves to DB
     console.log("About to call events get api ");
     User1.add_planner(num_of_days,req.body.budget,req.body.location,vacaType.substring(0,vacaType.length-1),email)
          .then(result => {
               console.log("add planner result" + result);
               User1.load(email).then(dbres => {
                    // Sends the most recently added planner
                    res.send(dbres.planner[dbres.planner.length-1]);
               });
          });
});

//Login function, checks and authenticates users
app.post("/", function (req, res) {
     email = "";
    sess=req.session;
    console.log("Post received from post");
    sess.email = req.body.username;
    sess.password = req.body.password;
    email = req.body.email;
    User1= new User(email);
    User1.setEmail(email);
    console.log(email);
    storage.login_verification(req.body.email,req.body.password).then(result => res.send(result));
});

//Sign up function, creates new entry in the DB
app.post('/signup', function(req,res){
    sess=req.session;
    console.log("Post received from post");
    sess.name=req.body.name;
    sess.email=req.body.email;
    sess.password=req.body.password;

    email = sess.email;
    var code = makeid();
    console.log("CODE IS :: "+ code);
    server_code = code;
    sendEmail(email,code);
    User1= new User(email);
    User1.setPassword(req.body.password);
    User1.setName(req.body.name);
    User1.setEmail(req.body.email);
    User1.save().then(results=> res.send(results));
});

/*Checks to see if user inputted correct verification code
  returns true or false
*/
app.post('/verificationcode', function (req, res) {
     sess=req.session;
    console.log("Post received from post :: VERIFICATION CODE");
    console.log(req.body.verificationcode);
    console.log("CORRECT VERIFICATION IS :: "+ server_code);
    if(req.body.verificationcode == server_code){
         res.send("true");
    }else{
         res.send("false");
    }
});

app.post("/verify",function(req,res){
     sess=req.session;
     console.log("forgot pass email :: "+req.body.email);
     var resetPassword = makeid();
     console.log("new forgot pass :: "+resetPassword);
     storage.updateUserPassword(req.body.email,resetPassword).then(
          result => {
               //console.log(result);
               if(result){
                    res.send(true);
                    sendForgotPassword(req.body.email, resetPassword);
               } else {
                    res.send(false);
               }
          }
     );
})

app.get('/logout',function(req,res){
     req.session.destroy(function(err) {
       if(err) {
         console.log(err);
       } else {
         res.send('true');
       }
     })
});

//Deletes planner given their unique id
app.post('/deletePlanner', function(req, res) {
    User1.delete_planner(req.body.itemId).then(results => res.send(results));
});

//Deletes event given their unique id
app.post('/deleteEvent', function(req, res) {
    User1.delete_event(req.body.plannerID, req.body.itemId).then(results => res.send(results))
});


//Server is currently serving on port 8420
app.listen(8420, function startServer() {
     storage.connect();
     console.log("Listening on :: " + 8420);
});


//*******************************FUNCTIONS************************************//
/** ****************************************************************************
  * Name:       makeid()
  *             Function creates a unique ID
  *
  * @param
  * @returns    String
  *****************************************************************************/
function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 8; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

/** ****************************************************************************
  * Name:       sendEmail()
  *             Function uses notemailer to create a transport and sends a
  *             verification email with the verification code
  *
  * @param      email <string> :: code <string>
  * @returns
  *****************************************************************************/
function sendEmail(email,code){
     //sess=req.session;
     var rec_email = email;
     //var code = "ABC";
     console.log("send EMAIL CALLED :: " + email);
     var transporter = nodemailer.createTransport(
          smtpTransport({
        service: 'Gmail',
        auth: {
            user: 'evaca8420@gmail.com', // Your email id
            pass: 'evacaproject' // Your password
       }})
 );

console.log('SMTP Configured');
     var mailOptions = {
          tls: { rejectUnauthorized: false },
           from: 'evaca8420@gmail.com', // sender address
           to: rec_email, // list of receivers
           subject: 'Welcome to eVaca', // Subject line
           text: "Welcome to eVaca, here's your verification code:" + code
     };
     transporter.sendMail(mailOptions, function(error, info){
         if(error){
             console.log(error);
         }else{
             console.log('Message sent: ' + info.response);
         };
     });
}


/** ****************************************************************************
  * Name:       sendForgotPassword()
  *             Function sends an email containing their new password
  *
  * @param      email <string> :: tempPassword <string>
  * @returns    boolean true or false
  *****************************************************************************/
function sendForgotPassword(email, tempPassword){
     //sess=req.session;
     var rec_email = email;
     //var code = "ABC";
     console.log("send EMAIL CALLED :: " + email);
     var transporter = nodemailer.createTransport(
          smtpTransport({
        service: 'Gmail',
        auth: {
            user: 'evaca8420@gmail.com', // Your email id
            pass: 'evacaproject' // Your password
       }})
 );

 console.log('SMTP Configured');
     var mailOptions = {
          tls: { rejectUnauthorized: false },
           from: 'evaca8420@gmail.com', // sender address
           to: rec_email, // list of receivers
           subject: 'Evaca New Password', // Subject line
           text: "Here's your new password:" + tempPassword
     };
     //console.log(mailOptions);
     transporter.sendMail(mailOptions, function(error, info){
         if(error){
             console.log(error);
             return false;
         }else{
             console.log('Message sent: ' + info.response);
             return true;
         };
     })

         console.log('returning true');
         return true;
}
