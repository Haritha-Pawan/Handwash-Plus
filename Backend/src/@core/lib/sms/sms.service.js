import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendWhatsApp = async (to, messageBody) => {
  const result = await client.messages.create({
    from: "whatsapp:+14155238886",
    body: messageBody,
    to: `whatsapp:${to}`,
  });

  console.log(`[WhatsApp] Sent to ${to} — SID: ${result.sid}`);
  return result;
};

export const sendSanitizerAlertWhatsApp = async (adminPhone, schoolName, criticalGrades) => {
  const gradeLines = criticalGrades
    .map((grade) => {
      const status = grade.sanitizer.status.toUpperCase();
      const quantity = grade.sanitizer.currentQuantity;
      const unit = grade.sanitizer.unit;
      return `• Grade ${grade.gradeNumber} → ${status} (${quantity}${unit})`;
    })
    .join("\n");

  const message = [
    `*HandWash+ Alert — ${schoolName}*`,
    `Grades needing attention:`,
    gradeLines,
    `Please refill sanitizer immediately.`,
  ].join("\n");

  return sendWhatsApp(adminPhone, message);
};
