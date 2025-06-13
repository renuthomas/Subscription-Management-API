import Subscription from '../models/subscription.model.js';
import dayjs from 'dayjs';
import { sendReminderEmail } from '../utils/send-email.js';

import {createRequire} from 'module';
const require=createRequire(import.meta.url);
const {serve}=require('@upstash/workflow/express');

const REMINDERS=[7,5,2,1];

export const sendReminder=serve(async(context)=>{
    const {subscriptionId}=context.requestPayload;
    console.log(`Received reminder for subscription ${subscriptionId}`);
    const subscription=await fetchSubscription(context,subscriptionId);

    if(!subscription || subscription.status!=='active') return;

    const renewalDate=dayjs(subscription.renewalDate);
    console.log("renewalDate", renewalDate.format('YYYY-MM-DD'));

    if(renewalDate.isBefore(dayjs())){
        console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow`);
        return;
    }

    for (const daysBefore of REMINDERS) {
        const reminderDate=renewalDate.subtract(daysBefore,'day');
        console.log("reminderDate", reminderDate.format('YYYY-MM-DD'));
        
        if(reminderDate.isAfter(dayjs(),'day')){
            console.log(`Sleeping until ${daysBefore} days before renewal date for subscription ${subscriptionId}`);
            await sleepuntilreminder(context,`${daysBefore} days before`,reminderDate);
        }


        if(reminderDate.isSame(dayjs(),'day')){
            console.log(`Sending reminder for subscription ${subscriptionId} to user ${subscription.user.name}`);
            await triggerReminder(context,`${daysBefore} ${daysBefore==1 ? "day":"days"} before reminder`,subscription);
        }
    }
})

const fetchSubscription=async(context,subscriptionId)=>{
    return await context.run("get subscription",async ()=>{
        return Subscription.findById(subscriptionId).populate('user','name email');
    })
}
const sleepuntilreminder=async(context,label,date)=>{
    console.log(`Sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label,date.toDate());
}

const triggerReminder=async(context,label,subscription)=>{
    return await context.run(label,async()=>{
        console.log(`Triggering reminder for ${label}`);
        await sendReminderEmail({
            to:subscription.user.email,
            type:label,
            subscription
        });
    })
}
