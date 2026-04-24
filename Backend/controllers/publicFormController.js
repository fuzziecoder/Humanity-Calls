import PublicSubmission from "../models/PublicSubmission.js";
import { triggerEmail } from "./emailController.js";

const isValidPhone = (phone) => /^[0-9]{10}$/.test(String(phone || "").trim());

const toLabel = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const esc = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const buildRows = (data) =>
  Object.entries(data)
    .map(([key, value]) => {
      const raw = String(value ?? "").trim();
      const isImageUrl =
        /^https:\/\/\S+$/i.test(raw) && /\.(png|jpe?g|webp|gif|avif)(\?.*)?$/i.test(raw);
      const valueHtml = isImageUrl
        ? `<a href="${esc(raw)}" style="color:#020887;">Open image</a><br/><img src="${esc(raw)}" alt="" width="260" style="max-width:100%;border-radius:8px;" />`
        : esc(raw || "—");
      return `
        <tr>
          <td style="padding:12px;border-bottom:1px solid #E6E1DC;font-weight:600;color:#4A4A68;font-size:14px;width:40%;">
            ${esc(toLabel(key))}
          </td>
          <td style="padding:12px;border-bottom:1px solid #E6E1DC;color:#1E1E2F;font-size:14px;word-break:break-word;">
            ${valueHtml}
          </td>
        </tr>
      `;
    })
    .join("");

const buildHtml = (type, data) => `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#FBF7F4;font-family:Arial,sans-serif;">
  <table width="100%" cellspacing="0" cellpadding="0" bgcolor="#FBF7F4">
    <tr><td align="center" style="padding:20px 10px;">
      <table style="width:100%;max-width:620px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.08);" cellspacing="0" cellpadding="0">
        <tr><td style="padding:20px 25px;border-bottom:1px solid #E6E1DC;">
          <strong style="font-size:22px;color:#C62828;">Humanity Calls</strong>
        </td></tr>
        <tr><td style="padding:25px;">
          <div style="display:inline-block;background:#020887;color:#fff;padding:6px 14px;border-radius:6px;font-size:12px;font-weight:700;text-transform:uppercase;margin-bottom:14px;">${esc(type)}</div>
          <h2 style="margin:0;color:#1E1E2F;">New Public Submission</h2>
        </td></tr>
        <tr><td style="padding:0 25px 30px;">
          <table width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #E6E1DC;border-radius:10px;overflow:hidden;">
            ${buildRows(data)}
          </table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

export const submitPublicBloodDonation = async (req, res) => {
  try {
    const data = req.body?.data || {};
    const name = String(data.name || "").trim();
    const email = String(data.email || "").trim();
    const phone = String(data.phone || "").trim();
    const bloodGroup = String(data.bloodGroup || "").trim();
    const cityLocation = String(data.cityLocation || "").trim();

    if (!name || !email || !phone || !bloodGroup || !cityLocation) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (!email.includes("@")) {
      return res.status(400).json({ message: "Enter a valid email" });
    }
    if (!isValidPhone(phone)) {
      return res.status(400).json({ message: "Phone must be exactly 10 digits" });
    }

    const record = await PublicSubmission.create({ kind: "blood_donation", data });
    res.status(201).json({ message: "Submission received", id: record._id });

    const emailTo = process.env.EMAIL_TO;
    const senderEmail = process.env.BREVO_SENDER_EMAIL;
    const senderName = process.env.BREVO_SENDER_NAME || "Humanity Calls";
    if (process.env.BREVO_API_KEY && emailTo && senderEmail) {
      triggerEmail({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: emailTo }],
        subject: `New Blood Donation Pledge from ${name}`,
        htmlContent: buildHtml("Blood Donation Pledge", {
          ...data,
          source: "Public (No Login)",
        }),
      }).catch((err) => console.error("Public blood pledge email error:", err.message));
    }
  } catch (error) {
    console.error("submitPublicBloodDonation error:", error);
    res.status(500).json({ message: "Unable to submit form" });
  }
};
