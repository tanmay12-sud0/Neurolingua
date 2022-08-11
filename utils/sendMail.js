const nodemailer = require('nodemailer');
const secureData = require('./secureData');
const {remarkedMailTemplate,verifiedMailTemplate,sendResetPasswordCode,verifyEmailLinkTemplate,emailVerifiedSuccess,passwordResetSuccess} = require('./emailTemplate')

function generateEmail(userName, email, type, data) {
    // console.log(data)
    // Link
    if (type === 1) {
        
        return verifyEmailLinkTemplate(data)
    }
    if (type === 2) {
        return sendResetPasswordCode(data)
    }
    if (type === 3) {
        return remarkedMailTemplate(data)
    }
    if (type === 4) {
        return verifiedMailTemplate(data)
    }

    if(type === 5){
        return emailVerifiedSuccess(data)
    }

    if(type === 7){
        return passwordResetSuccess(data)
    }

}

function generateMailOptions(userName, email, type, data) {
    if (type === 1) {
        var mailOptions = {
            from: `${process.env.EMAIL}`,
            to: email,
            subject: 'Confirm your account on Neurolingua',
            html: generateEmail(userName, secureData.encrypt(email), type, data)
        };
        return mailOptions;
    }
    if (type === 2) {
        var mailOptions = {
            from: `${process.env.EMAIL}`,
            to: email,
            subject: 'Reset your account password on Neurolingua',
            html: generateEmail(userName, secureData.encrypt(email), type, data)
        };
        return mailOptions;
    }
    if (type === 3) {
        var mailOptions = {
            from: `${process.env.EMAIL}`,
            to: email,
            subject: `${data.type} not approved`,
            html: generateEmail(userName, secureData.encrypt(email), type, data)
        }
        return mailOptions;
    }
    if (type === 4) {
        var mailOptions = {
            from: `${process.env.EMAIL}`,
            to: email,
            subject: `${data.type} approved`,
            html: generateEmail(userName, secureData.encrypt(email), type, data)
        }
        return mailOptions;
    }
    if(type === 5){
        var mailOptions = {
            from: `${process.env.EMAIL}`,
            to: email,
            subject: `Neurolingua | Account Verified`,
            html: generateEmail(userName, secureData.encrypt(email), type, data)
        }
        return mailOptions;
    }
    if(type === 6){
        // console.log(email,"mailId");
        let date  = new Date()
        var mailOptions = {
            from: `${process.env.EMAIL}`,
            to: email,
            subject: `Neurolingua | Password Changed`,
            html: `Your password has been changed on ${date.toDateString()}`
        }
        // console.log(mailOptions);
        return mailOptions;

    }
    if(type === 7){
        var mailOptions = {
            from: `${process.env.EMAIL}`,
            to: email,
            subject: `Neurolingua | Password Reset`,
            html: generateEmail(userName, secureData.encrypt(email), type, data)
        }
        return mailOptions;
    }
    if(type === 8){
    
        var mailOptions = {
            from: `${process.env.EMAIL}`,
            to: email,
            subject: `Neurolingua | Query`,
            html: `<p> Name: ${data.name}</p>
            <p> Email: ${data.email}</p>
            <p> Message: ${data.message}</p>
            <p> Sent On: ${data.time}</p>
            
            `
        }
        return mailOptions;
    }
}
/**
 * ZOHO credentials
 */
var transporter = nodemailer.createTransport({
    host: "smtp.zeptomail.in",
    port: 587,
    auth: {
    user: `${process.env.ZOHO_EMAIL}`,
    pass: `${process.env.ZOHO_EMAIL_PASS}`
    }
});

// var transporter = nodemailer.createTransport({
//     host: `${process.env.EMAILHOST}`,
//     port: `${process.env.EMAILPORT}`,
//     auth: {
//         user: `${process.env.EMAIL}`,
//         pass: `${process.env.PASSMAIL}`
//     }
// });
/*
 * 
 * @param {String} userName 
 * @param {String} email 
 * @param {Integer} type 
 * @param {String} data 
 */
async function sendMail(userName, email, type, data) {
    const obj = {
        send: "true"
    };
    // console.log(email,"mailId");
    transporter.sendMail(generateMailOptions(userName, email, type, data), function (error, info) {
        if (error) {
            console.log(error,"e");
            obj.send = "false"
        } else {
            console.log('Email sent: ' + info.response);
            obj.send = "true"
        }
    });
    const isEmailSend = new Promise((resolve, reject) => {
        if (obj.send === "true") {
            const emailSend = "Email sent"
            resolve(emailSend)
        } else {
            const why = "wait"
            reject(why)
        }
    })
    const checkIsEmailSend = () => {
        isEmailSend.then(result => {
            console.log(result)
            // res.send("Email Sent")
        }).catch(err => {
            console.log(err,"Mail Error")
            // res.send("Email not sent")
        })
    }
    checkIsEmailSend()
}
module.exports = {
    sendMail: sendMail
}

