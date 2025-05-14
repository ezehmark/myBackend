require("dotenv").config();
const myNodeMailer = require("nodemailer");
const myExpress = require("express");
const myApp = myExpress();
const {createServer} = require("http");
const { Server } = require("socket.io");
const axios = require("axios");
const myCors = require("cors");
const Mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;
const http = require("http");
const WebSocket = require("ws");
const {v4 : uuidv4} = require("uuid");

const server = http.createServer(myApp);

const myWs = new WebSocket.Server({server});
const {Resend} = require("resend");
const resend = new Resend("re_9XM2FoGB_MykVFypWBQDC9tgwiQ7vSzk5");

myApp.use(myCors());
myApp.use(myExpress.json());


var chats = [];

const myTransporter = myNodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


myApp.post("/send-mail", async (req, res) => {
  try {
    const { recipient, subject, message } = req.body;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipient,
      subject: subject,
      html: message,
    };

    await myTransporter.sendMail(mailOptions);
    res.status(200).json({
      message: `Your email has been sent successfully to the designated receiving email address.\n${recipient}\n The work of Mark Ezeh!`,
      msg: "✉ Email sent successfully",
    });
  } catch (error) {
    res.json({
      message: `Attempt to send email message failed. This is due to ${error}`,
    });
  }
});
var users = [
  {
    name: "Mark",
    age: "27",
    uri: "https://i.postimg.cc/02bZZbk4/IMG-20241117-082335.jpg",
  },
  { name: "Peter", age: 56, uri: "" },
  { name: "Jesus", age: "ageless", uri: "" },
  { name: "Christ", age: "infinity", uri: "" },

  { name: "James", age: "40", uri: "" },
  { name: "OD", age: "32", uri: "" },
];

var user;
const Pusher = require("pusher");
const myPusher = new Pusher({
appId: "1974555",
  key: "9f6c0b8345c2297e09e6",
  secret: "13f0f60338b5057aad38",
  cluster: "eu",
  useTLS: true
});


myApp.post("/chats", (req, res) => {
  try {
    const { myChats } = req.body;
    chats = [...chats, myChats];
 myPusher.trigger("chat-channel", "chatance", myChats);
    res.status(200).json({ msg: "Chat Sent" });
  } catch (err) {
    res.json({ errMsg: err.message });
  }
});




myApp.get("/health", (req, res) => {
  res.status(200).json({ msg: "Backend is now Active" });
});

myApp.get("/api/userDetails/:name", async (req, res) => {
  const newName = req.params.name;

  user = users.find((u) => u.name === newName);
  if (user) {
    res.json(user);
  } else {
    res
      .status(404)
      .json({ message: `${newName}  not found in Mark's strong  database!` });

    console.log("There is an issue fetching");
  }
});
myApp.post("/api/userDetails", async (req, res) => {
  try {
    const { newPeople } = req.body;
    if (newPeople) {
      users = [...users, ...newPeople];
      res.json(users);
    } else {
      res.status(400).json(error.message);
    }
  } catch (error) {
    console.error(`server encountered ${error} while uploading`);
  }
});

myApp.get("/prices", async (req,res)=>{
const response = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd");
res.json(response);
 });


myWs.on("connection",(socket)=>{
const coinCapWs = new  WebSocket("wss://wss.coincap.io/prices?assets=bitcoin,ethereum,solana&apiKey=d9bbb9c22fa2553ad23fd9e95430ce31f26565427716b263fcc82b3565e90d8a");

coinCapWs.on("message",(data)=>{
socket.send(data.toString())});
coinCapWs.on("close",()=>socket.close());

socket.on("close", ()=>socket.close());

});

const mongooseSchema = new Mongoose.Schema({
	token:{type:String},
email:{type:String},
name:{type:String},
isVerified:{type:Boolean,default:false},
});
const Bitbanker_User = Mongoose.model("Bitbanker_User",mongooseSchema);

myApp.get("/verify/:token", async(req,res)=>{
try{
	const userToken = req.params.token;
	const existUser = await Bitbanker_User.findOne({token:userToken});
if(existUser){
res.json({msg:"You are now registered",redirectLink:"home"});
	exitUser.isVerified=true;
	await existUser.save();
	res.redirect("https://bitbanker.netlify.app/home?verified=true")
}
	else{res.json({msg:"invalid or expired token access"})}}
catch(error){res.json({msgErr:`Failed due to ${error}`})}

});



myApp.post("/postAndVerify", async(req,res)=>{
try{const {email,name}=req.body;
const token = uuidv4();
const existedUser = await Bitbanker_User.findOne({email});
	if(existedUser){res.json({msg:"You have registered before"})}
const verificationLink = `https://mybackend-oftz.onrender.com/verify/${token}`;
const newUser = new Bitbanker_User({email,name,token,isVerified:false});

await newUser.save();

await resend.emails.send({
from:'onboarding@resend.dev',
to:email,
subject:"Verify your email address, to complete signup",
html:`<!DOCTYPE html>
<html>                                                                                                                  <head>                                                                                                                  <meta charset="UTF-8">                                                                                                <title>Web and App Technology Simplified</title>
  </head>                                                                                                               <body style="margin: 0; padding: 0; background-color: #f4f4f4;">                                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f4f4; padding: 20px;">
      <tr>                                                                                                                    <td align="center">
          <table role="presentation" width="350px" cellspacing="0" cellpadding="0" border="0" style="background-color: white; border: 2px solid #222021; border-radius: 20px; padding: 15px; text-align: center;">                                      <!-- Logo -->                                                                                                         <tr>                                                                                                                    <td style="background-color: #222021; color: white; font-size: 20px; padding: 10px; border-radius: 0px 2
0px 0px 20px;">
                <b style="color:#f7b21d">Bytance</b><b style="color:#d50204">Tech</b>
              </td>                                                                                                               </tr>                                                                                                     
            <!-- Greeting -->
            <tr>
              <td style="color:#4fe300; font-size: 25px; padding-top: 10px;">
                Dear ${email.split("@")[0]},
              </td>
            </tr>

            <!-- Main Message -->
            <tr>                                                                                                                    <td style="color:#1e324b; font-size: 16px; padding: 15px; line-height: 1.5; text-align: left;">
                The time to get it done is here – not just that, but by <b style="color:#00ff00;">professional</b> han
ds in web and app development.
                Our robust team of developers fast-track the build process to deliver apps that are
                <b style="color:#00ff00">scalable, performant, and accessible</b> across devices.
                All these at affordable prices.<br><br>
                Click the button below to get it done today!
              </td>
            </tr>

            <!-- Button -->
            <tr>                                                                                                                    <td align="center" style="padding: 20px 0;">
                <a href="${verificationLink}" style="background-color: #4fe300; color: black; text-decoration:
 none; font-size: 16px; padding: 10px 20px; border-radius: 20px; display: inline-block;">
                  Verify my email
                </a>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="color: gray; font-size: 10px; padding-top: 10px;">
                This email was sent from <b>BytanceTech</b> &copy;2025
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`



})}
catch(error){
res.json({msgErr:`failed to signup due to ${error}`})}});





server.listen(PORT, () => {
  console.log(`My App is currently running at port: ${PORT}`);
});
