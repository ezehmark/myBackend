require("dotenv").config();
const myNodeMailer = require("nodemailer");
const myExpress = require("express");
const myApp = myExpress();
const { createServer } = require("http");
const { Server } = require("socket.io");
const axios = require("axios");
const myCors = require("cors");
const Mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;
const http = require("http");
const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");

const server = http.createServer(myApp);

const myWs = new WebSocket.Server({ server });

Firebase Admin imports and setUps:

const db = require("./admin.js");


myApp.use(myCors());
myApp.use(myExpress.json());

/*const mongUrl =
  "mongodb+srv://ezehmark1:MarkMongodb5050@cluster0.g2cxv.mongodb.net/mydb?retryWrites=true&w=majority";

Mongoose.connect(mongUrl);*/
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

myApp.post("/chats", async (req, res) => {
  try {
    const { myChats } = req.body;
    chats = [...chats, myChats];
    await myPusher.trigger("chat-channel", "chatance", myChats);
    res.status(200).json({ msg: "Chat Sent" });
  } catch (err) {
    res.json({ errMsg: err.message });
  }
});

myApp.get("/health", (req, res) => {
  res.status(200).json({ msg: "Backend is now Active" });
});


//CS Agent messages handling

const io = new Server(server, {
  cors: { origin: "*", methods: ["POST", "GET"] },
});

io.on("connection", (socket) => console.log("socket connected", socket.id));
myApp.post("/CSAgent", async (req, res) => {
  try {
    //Getting current time:
    const date = new Date();
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const thisMonth = months[date.getMonth()];
    const thisDay = date.getDate();
    const thisHour = date.getHours();
    const thisMinute = date.getMinutes().toString().padStart(2, "0");
    const meridian = thisHour >= 12 ? "pm" : "am";
    let hour = thisHour % 12;
    hour = hour ? hour : 12;
    const dateTime = `${thisDay} ${thisMonth}, ${hour}:${thisMinute} ${meridian}`;

    const msgArray = req.body;
    const msgArrayWithTime = msgArray.map((item) => ({
      ...item,
      date: dateTime,
    }));
    io.emit("complaints", msgArrayWithTime);
    console.log(
      msgArrayWithTime[0].msg,
      msgArrayWithTime[0].date,
      msgArrayWithTime[0].name,
    );
    console.log("123457, uuidv4 aint working?",uuidv4());
    await db.collection("Cs_Agents").doc(uuidv4()).set({
      msg: msgArrayWithTime[0]?.msg,
      name: msgArrayWithTime[0]?.name,
      time: msgArrayWithTime[0]?.date,
    });
    res.json({ feedback: `Your complaint has been received, ${uuidv4()}` });
  } catch (err) {
    console.error("Setting doc failed:", err);
    res.status(500).json(err);
  }
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


const mongooseSchema = new Mongoose.Schema({
  token: { type: String },
  email: { type: String },
  name: { type: String },
  isVerified: { type: Boolean, default: false },
});
const Bitbanker_User = Mongoose.model("Bitbanker_User", mongooseSchema);

const brevoTransporter = myNodeMailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "8d034f001@smtp-brevo.com",
    pass: "mCyqRGr8n1wd3OJQ",
  },
});

myApp.get("/verify/:token", async (req, res) => {
  try {
    const userToken = req.params.token;
    const existUser = await Bitbanker_User.findOne({ token: userToken });
    if (existUser) {
      existUser.isVerified = true;
      await existUser.save();
      res.redirect("https://bitbanker.netlify.app/home?verified=true");
    } else {
      res.json({ msg: "invalid or expired token access" });
    }
  } catch (error) {
    res.json({ msgErr: `Failed due to ${error}` });
  }
});

myApp.post("/postAndVerify", async (req, res) => {
  try {
    const { email, name } = req.body;
    const token = uuidv4();
    const existedUser = await Bitbanker_User.findOne({ email });
    if (existedUser) {
      return res.json({ msg: "You have registered before" });
    }
    const verificationLink = `https://mybackend-oftz.onrender.com/verify/${token}`;
    const newUser = new Bitbanker_User({
      email,
      name,
      token,
      isVerified: false,
    });

    await newUser.save();

    const brevoMailOptions = {
      from: "ezehmark@gmail.com",
      to: email,
      subject: "Verify your email for Bitbanker",
      html: `<!DOCTYPE html>                                                                   <html>                                                                                                                  <head>                                                                                                                  <meta charset="UTF-8">                                                                                                <title>Web and App Technology Simplified</title>                                    </head>                                                                                                               <body style="margin: 0; padding: 0; background-color: #f
4f4f4;">                                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f4f4; padding: 20px;">                                                                         <tr>                                                                                                                    <td align="center">                                         <table role="presentation" width="350px" cellspacing="0" cellpadding="0" border="0" style="background-color: white; border: 2px solid #222021; border-radius: 20px; pa
dding: 15px; text-align: center;">                                      <!-- Logo -->

              <tr>                                                                                                                    <td style="background-color: #222021; color: white; font-size: 20px; padding: 10px; border-radius: 0px 2
0px 0px 20px;">
                <b style="color:#f7b21d">Bytance</b><b style="color:#d50204">Tech</b>
              </td>
                                          </tr>

            <!-- Greeting -->
            <tr>
              <td style="color:#4fe300; font-size: 25px; padding-top: 10px;">
                Dear ${email.split("@")[0]},                                                          </td>                                                                                 </tr>
                                                                                                    <!-- Main Message -->
            <tr>
                                            <td style="color:#1e324b; font-size: 16px; padding: 15px; line-height: 1.5; text-align: left;">
                The time to get it done is here – not just that, but by <b style="color:#00ff00;">professional</b> han
ds in web and app development.
                Our robust team of developers fast-track the build process to deliver ap
ps that are
                <b style="color:#00ff00">scalable, performant, and accessible</b> across
 devices.
                All these at affordable prices.<br><br>                                                 Click the button below to get it done today!                                          </td>
            </tr>                                                                       
            <!-- Button -->                                                                         <tr>
                                            <td align="center" style="padding: 20px 0;">
                <a href="${verificationLink}" style="background-color: #4fe300; color: b
lack; text-decoration:
 none; font-size: 16px; padding: 10px 20px; border-radius: 20px; display: inline-block;">                                                                                                         Verify my email                                                                       </a>
              </td>
            </tr>
                                                                                                    <!-- Footer -->                                                                         <tr>                                                                                      <td style="color: gray; font-size: 10px; padding-top: 10px;">                             This email was sent from <b>BytanceTech</b> &copy;2025
              </td>
            </tr>                                                                                 </table>                                                                              </td>                                                                                 </tr>                                                                                 </table>                                                                              </body>                                                                               </html>`,
    };

    await myTransporter.sendMail(brevoMailOptions);
  } catch (error) {
    res.json({ msgErr: `failed to signup due to ${error}` });
  }
});

myApp.get("/coingecko/charts", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart",
      { params: { vs_currency: "usd", days: "7" } },
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

server.listen(PORT, () => {
  console.log(`My App is currently running at port: ${PORT}`);
});
