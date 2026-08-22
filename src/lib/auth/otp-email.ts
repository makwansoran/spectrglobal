import { site } from "@/lib/site";
import type { AccountKind } from "@/lib/auth/account";

type OtpEmailCopy = {
  heading: string;
  intro: string;
  accountLabel: string;
};

export function otpEmailCopy(kind: AccountKind, purpose: "login" | "signup"): OtpEmailCopy {
  const careers = kind === "careers";
  if (purpose === "signup") {
    return {
      heading: careers ? "Confirm your careers account" : "Confirm your Spectr account",
      intro: "Use this code to finish creating your account. It expires in 10 minutes.",
      accountLabel: careers ? "Spectr Careers" : "Spectr",
    };
  }
  return {
    heading: careers ? "Careers sign-in code" : "Sign-in code",
    intro: "Use this code to complete two-factor authentication. It expires in 10 minutes.",
    accountLabel: careers ? "Spectr Careers" : "Spectr",
  };
}

export function buildOtpEmailHtml(input: {
  code: string;
  heading: string;
  intro: string;
  accountLabel: string;
  logoUrl: string;
}) {
  const { code, heading, intro, accountLabel, logoUrl } = input;

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#ffffff;font-family:Inter,Arial,sans-serif;color:#0a0a0a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ffffff;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;">
            <tr>
              <td style="padding-bottom:28px;">
                <!-- PLACE: logo -->
                <img src="${logoUrl}" alt="Spectr" width="40" height="40" style="display:block;border:0;" />
              </td>
            </tr>
            <tr>
              <td style="padding-bottom:12px;">
                <!-- PLACE: heading -->
                <h1 style="margin:0;font-size:28px;line-height:1.15;letter-spacing:-0.04em;font-weight:600;">${heading}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding-bottom:8px;">
                <!-- PLACE: account -->
                <p style="margin:0;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:#6b6b72;">${accountLabel}</p>
              </td>
            </tr>
            <tr>
              <td style="padding-bottom:24px;">
                <!-- PLACE: intro -->
                <p style="margin:0;font-size:15px;line-height:1.6;color:#5c5c62;">${intro}</p>
              </td>
            </tr>
            <tr>
              <td style="padding-bottom:24px;">
                <!-- PLACE: code -->
                <div style="border:1px solid #e6e6e6;padding:18px 20px;text-align:center;">
                  <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#8a8f94;">Authentication code</p>
                  <p style="margin:0;font-size:32px;letter-spacing:0.28em;font-weight:600;">${code}</p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding-bottom:28px;">
                <!-- PLACE: expiry -->
                <p style="margin:0;font-size:13px;line-height:1.6;color:#8a8f94;">This code expires in 10 minutes. If you did not request it, you can ignore this email.</p>
              </td>
            </tr>
            <tr>
              <td style="border-top:1px solid #e6e6e6;padding-top:18px;">
                <!-- PLACE: footer -->
                <p style="margin:0;font-size:12px;line-height:1.6;color:#8a8f94;">${site.legalName} · ${site.location}<br />${site.url}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function otpLogoUrl() {
  return `${site.url}/spectr-logo-black.png`;
}
