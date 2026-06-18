import nodemailer from 'nodemailer'


export const node_mailer = (to,message,subject) => {
    const mailData = {
    from: process.env.email,  
    to: to,   // list of receivers
    subject: subject ?? 'Welcome To RecipeAPI',
    text: message ?? 'Thank you for signing up now you are in'
    }



    const transporter = nodemailer.createTransport({
    port: 465,               // true for 465, false for other ports
    host: "smtp.gmail.com",
    auth: {
            user: process.env.email,
            pass: process.env.password,
        },
    });
    transporter.sendMail(mailData,(error,info)=>{
        if(error){
            return console.log(error)
        }
        return info.messageId
    })
}

