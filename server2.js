require("dotenv").config();
const myExpress = require("express");
const myCors = require("cors");
const myApp2 = myExpress();
myApp2.use(myCors());
myApp2.use(myExpress.json());
const myNodeMailer = require("nodemailer");

const transporter = myNodeMailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
});


myApp2.post("/send-mail", async(req,res)=>{
    try{const{recipient,subject,message}= req.body;
    
    const mailOptions ={
        from:process.env.EMAIL_USER,
        to: recipient,
        subject:subject,
        text:message
    }
    
    await transporter.sendMail(mailOptions);
    res.json({message:"Email has been sent successfully from Mark's backend"})
    }
    
    catch(err){console.error(err);
    res.json({message:`Oops, failed to send email. This is because ${err}`})}
});

const PORT = 3500;
myApp2.listen(PORT,()=>console.log(`My App is now Active on: ${PORT}`))
