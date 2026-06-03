import { escapeHtml } from "./brevo";
import type { DemoRegistrationDetails } from "./demo-details";

function topicsListHtml(topics: string[], accent: string): string {
  return topics
    .map(
      (t) =>
        `<tr><td style="padding:0 0 10px 0;vertical-align:top;width:22px;color:${accent};font-size:14px;line-height:1.5;">✓</td>` +
        `<td style="padding:0 0 10px 0;font-size:14px;line-height:1.65;color:rgba(255,255,255,0.78);">${escapeHtml(t)}</td></tr>`,
    )
    .join("");
}

export function demoConfirmationEmailHtml(
  name: string,
  demo: DemoRegistrationDetails,
  siteUrl: string,
  contactEmail = "info@nexpertsai.com",
): string {
  const safeName = escapeHtml(name);
  const demoUrl = `${siteUrl.replace(/\/$/, "")}/demo`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Your ${escapeHtml(demo.title)} registration is confirmed</title>
</head>
<body style="margin:0;padding:0;background:#060910;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#dde1ea;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#060910;padding:36px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#0d1117;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:32px 32px 24px;background:linear-gradient(145deg,#121820 0%,#0d1117 60%);border-bottom:1px solid ${demo.accent}33;">
              <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${demo.accent};font-weight:600;margin-bottom:10px;">Nexperts Academy · Live Demo</div>
              <h1 style="margin:0;font-size:26px;line-height:1.2;font-weight:600;color:#ffffff;">You're registered, ${safeName}</h1>
              <p style="margin:14px 0 0;font-size:15px;line-height:1.65;color:rgba(255,255,255,0.72);">
                Your seat for <strong style="color:#ffffff;">${escapeHtml(demo.title)}</strong> is confirmed.
                ${escapeHtml(demo.subtitle)}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px 8px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${demo.accentSoft};border:1px solid ${demo.accent}40;border-radius:12px;">
                <tr>
                  <td style="padding:22px 24px;">
                    <div style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:${demo.accent};font-weight:700;margin-bottom:14px;">Session details</div>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:rgba(255,255,255,0.5);width:72px;vertical-align:top;">Date</td>
                        <td style="padding:6px 0;font-size:15px;color:#ffffff;font-weight:500;">${escapeHtml(demo.dateDisplay)}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:rgba(255,255,255,0.5);vertical-align:top;">Day</td>
                        <td style="padding:6px 0;font-size:15px;color:#ffffff;font-weight:500;">${escapeHtml(demo.day)}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:rgba(255,255,255,0.5);vertical-align:top;">Time</td>
                        <td style="padding:6px 0;font-size:15px;color:#ffffff;font-weight:500;">${escapeHtml(demo.time)}<br/><span style="font-size:12px;color:rgba(255,255,255,0.55);font-weight:400;">${escapeHtml(demo.timezone)}</span></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px 8px;">
              <div style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:${demo.accent};font-weight:700;margin-bottom:14px;">Join on Microsoft Teams</div>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#141b25;border:1px solid rgba(255,255,255,0.1);border-radius:12px;">
                <tr>
                  <td style="padding:22px 24px;">
                    <a href="${escapeHtml(demo.teamsJoinUrl)}" style="display:inline-block;padding:14px 28px;border-radius:8px;background:linear-gradient(135deg,${demo.accent},${demo.accent}cc);color:#020d09;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.04em;text-transform:uppercase;margin-bottom:18px;">Join Microsoft Teams meeting</a>
                    <p style="margin:0 0 8px;font-size:13px;color:rgba(255,255,255,0.55);">Meeting link</p>
                    <p style="margin:0 0 16px;font-size:13px;line-height:1.5;word-break:break-all;"><a href="${escapeHtml(demo.teamsJoinUrl)}" style="color:${demo.accent};text-decoration:underline;">${escapeHtml(demo.teamsJoinUrl)}</a></p>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding:10px 14px;background:rgba(0,0,0,0.25);border-radius:8px;border:1px solid rgba(255,255,255,0.06);width:48%;">
                          <div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.45);margin-bottom:4px;">Meeting ID</div>
                          <div style="font-size:15px;font-family:Consolas,'Courier New',monospace;color:#ffffff;letter-spacing:0.06em;">${escapeHtml(demo.meetingId)}</div>
                        </td>
                        <td style="width:4%;"></td>
                        <td style="padding:10px 14px;background:rgba(0,0,0,0.25);border-radius:8px;border:1px solid rgba(255,255,255,0.06);width:48%;">
                          <div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.45);margin-bottom:4px;">Passcode</div>
                          <div style="font-size:15px;font-family:Consolas,'Courier New',monospace;color:#ffffff;letter-spacing:0.08em;">${escapeHtml(demo.passcode)}</div>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:16px 0 0;font-size:12px;line-height:1.6;color:rgba(255,255,255,0.45);">Please join 5 minutes early to test audio and video. Save this email — you'll need the link and passcode on the day.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 32px 8px;">
              <div style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:${demo.accent};font-weight:700;margin-bottom:14px;">What we'll cover</div>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${topicsListHtml(demo.topics, demo.accent)}</table>
            </td>
          </tr>

          <tr>
            <td style="padding:8px 32px 28px;">
              <p style="margin:0 0 12px;font-size:13px;line-height:1.65;color:rgba(255,255,255,0.55);">
                ${demo.highlights.map((h) => escapeHtml(h)).join(" · ")}
              </p>
              <p style="margin:0;font-size:13px;line-height:1.65;color:rgba(255,255,255,0.45);">
                Questions before the session? Reply to this email or write to
                <a href="mailto:${escapeHtml(contactEmail)}" style="color:${demo.accent};text-decoration:underline;">${escapeHtml(contactEmail)}</a>
                · <a href="${demoUrl}" style="color:${demo.accent};text-decoration:underline;">nexpertsai.com/demo</a>
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px 32px;border-top:1px solid rgba(255,255,255,0.06);">
              <p style="margin:20px 0 0;font-size:12px;line-height:1.55;color:rgba(255,255,255,0.38);">
                Nexperts Academy Sdn Bhd · Petaling Jaya, Malaysia<br/>
                Live instructor-led AI programmes for professionals and teams
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function demoLeadNotificationHtml(
  name: string,
  email: string,
  phone: string,
  demo: DemoRegistrationDetails,
  source: string,
): string {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8" /></head>
<body style="margin:0;padding:24px;background:#f4f4f5;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111827;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:10px;">
    <tr><td style="padding:20px 24px;border-bottom:1px solid #e5e7eb;">
      <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#6b7280;">New demo registration</div>
      <h1 style="margin:8px 0 0;font-size:20px;">${escapeHtml(demo.title)}</h1>
    </td></tr>
    <tr><td style="padding:20px 24px;font-size:14px;line-height:1.65;">
      <p style="margin:0 0 8px;"><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p style="margin:0 0 8px;"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      <p style="margin:0 0 8px;"><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p style="margin:0 0 8px;"><strong>Session:</strong> ${escapeHtml(demo.sessionLabel)}</p>
      <p style="margin:0 0 8px;"><strong>Source:</strong> ${escapeHtml(source)}</p>
    </td></tr>
  </table>
</body></html>`;
}
