require("dotenv").config();
const myNodeMailer = require("nodemailer");
const myExpress = require("express");
const myApp = myExpress();
const {createServer} = require("http");
const { Server } = require("socket.io");
const axios = require("axios");
const myCors = require("cors");

const PORT = process.env.PORT || 3000;
const http = require("http");
const WebSocket = require("ws");

const server = http.createServer(myApp);

const myWs = new WebSocket.Server({server});

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

const WS_API_KEY ="d9bbb9c22fa2553ad23fd9e95430ce31f26565427716b263fcc82b3565e90d8a";

myWs.on("connection",(socket)=>{
const coinCapWs = new  WebSocket("wss://wss.coincap.io/prices?assets=bitcoin,ethereum,solana",{headers:{Authorization:`Bearer ${WS_API_KEY}`}});

coinCapWs.on("message",(data)=>{
socket.send(data.toString())});
coinCapWs.on("close",()=>socket.close());

socket.on("close", ()=>socket.close());

});

server.listen(PORT, () => {
  console.log(`My App is currently running at port: ${PORT}`);
});
