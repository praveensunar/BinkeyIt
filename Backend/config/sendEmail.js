import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
dotenv.config()

// if(!process.env.RESEND_API){
//     console.log("provide RESEND_API in side the .env file")
// }


// const resend = new Resend(process.env.RESEND_API);



// const sendEmail = async({sendTo,subject,html})=>{
//     try{
//         const { data, error } = await resend.emails.send({
//         from: 'Blinkeyit <onboarding@resend.dev>',
//         to: sendTo,
//         subject: subject,
//         html: html,
//         });

//         if (error) {
//             return console.error({ error });
//         }

//     return data
//     }catch(error){
//     console.log(error)
//     }

// }
// export default sendEmail




//--------------------------------------used personal mail--------------------------------

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "praveenv4440@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

const sendEmail = async ({ sendTo, subject, html }) => {
  if (!sendTo) {
    throw new Error("Receiver email is missing");
  }

  await transporter.sendMail({
    from: `"Blinkeyit" <praveenv4440@gmail.com>`,
    to: sendTo,
    subject,
    html
  });
};

export default sendEmail;
