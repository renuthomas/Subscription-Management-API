import { emailTemplates } from "./email-template.js";
import transporter from "../config/nodemailer.js";
import { EMAIL } from "../config/env.js";
import dayjs from "dayjs";


export const sendReminderEmail=async({to,type,subscription})=>{
    if(!to || !type){
        throw new Error("Missing required parameters: 'to' or 'type'");
    }
    
    const template=emailTemplates.find((t)=>t.label===type);

    if(!template){
        throw new Error(`Email template not found for type: ${type}`);
    }

    const mailinfo={
        userName: subscription.user.name,
        subscriptionName: subscription.name,
        renewalDate: dayjs(subscription.renewalDate).format('MMM D, YYYY'),
        planName: subscription.name,
        price:`${subscription.currency} ${subscription.price.toFixed(2)} ${subscription.frequency}`,
        paymentMethod: subscription.paymentMethod,
        accountSettingsLink: `https://subdub.com/account/${subscription.user.id}`,
        supportLink: "https://subdub.com/support"
    }

    const message=template.generateBody(mailinfo);
    const subject=template.generateSubject(mailinfo);
    const mailOptions={
        from: EMAIL,
        to:to,
        subject:subject,
        html:message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
        } else {
            console.log("Email sent successfully:", info.response);
        }
    });

}

