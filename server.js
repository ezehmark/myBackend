require("dotenv").config();
const myNodeMailer = require("nodemailer");
const myExpress = require("express");                           const myApp = myExpress();

const PORT = process.env.PORT;
const myCors = require('cors');
myApp.use(myCors());
myApp.use(myExpress.json());

const myTransporter = myNodeMailer.createTransport({
	service:"gmail",
auth:{
	user:process.env.EMAIL_USER,
pass:process.env.EMAIL_PASS}});

myApp.post("/send-mail", async(req,res)=>{
try{
var {recipient,subject,message} = req.body;
	message="The best tech hub is here! At BytanceTech, you get your web/app development done by experienced and professional developers. Reach out to us today for projects like static and dynamic websites, apps and web apps, Search Engine Optimizations(SEO), cybersecurity, productive and uptime robots to fast-track social media engagements, and many more in-demand services\nYou have this rare privilege to discuss with the team-lead:\nMessage .Mark{Ezeh} on WhatsApp. https://wa.me/2349036202766";
const mailOptions = {
	from:process.env.EMAIL_USER,
	to:recipient,
	subject:subject,
	text:message
}

await myTransporter.sendMail(mailOptions);
res.json({message:"Your email has been sent successfully to the designated receiving email address. The work of Mark Ezeh!"});

}
catch(error){
	res.json({message:`Attempt to send email message failed. This is due to ${error}`});
}});
var  users = [
        {name:"Mark", age:"27" },
        {name:"James", age:"40"},
        {name:"OD",age:"32"}
    ];
var user;
myApp.get("/health", (req,res)=>{
res.status(200)});

myApp.get("/api/userDetails/:name", async (req, res)=>{

    const newName = req.params.name;

        
		user= users.find(u => u.name === newName);
	if(user){res.json(user)}
		
        else{
                res.status(404).json({message:`${newName}  not found in Mark's strong  database!`});


        console.log("There is an issue fetching")}
});                                                             
myApp.post("/api/userDetails", async(req,res)=>{
	try{
		const {newPeople} = req.body;
		if(newPeople){
			users = [...users, ...newPeople];
		res.json(users)}
		else{
			res.status(400).json(error.message)
		}
	}
	catch(error){
		console.error(`server encountered ${error} while uploading`)
	}

})

myApp.listen(PORT, ()=>{
    console.log(`My App is currently running at port: ${PORT}`);
});
