import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendSMS = async (to, message) => {
  const result = await client.messages.create({
    body: message,                          // SMS text content
    from: process.env.TWILIO_PHONE_NUMBER,  // your Twilio number
    to,                                     // recipient number
  });

  console.log(`[SMS] Sent to ${to} — SID: ${result.sid}`);
  return result;
};

export const sendSanitizerAlertSMS = async (adminPhone, schoolName, criticalGrades) => {

const gradeLines = criticalGrades.map((grade) => {
    const status   = grade.sanitizer.status.toUpperCase();
    const quantity = grade.sanitizer.currentQuantity;
    const unit     = grade.sanitizer.unit;
    return `• Grade ${grade.gradeNumber} → ${status} (${quantity}${unit})`;
  }).join("\n");

  const message = [
    `HandWash+ Alert — ${schoolName}`,
    `Grades needing attention:`,
    gradeLines,
    `Please refill sanitizer immediately.`,
  ].join("\n");

  return sendSMS(adminPhone, message);
};
