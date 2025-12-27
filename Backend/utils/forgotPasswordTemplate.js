const forgotPasswordOtpTemplate = ({ name, otp }) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset Password OTP</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:20px;">
      <tr>
        <td align="center">
          
          <!-- Main Container -->
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <tr>
              <td style="background:#23ac65; padding:20px; text-align:center; color:#ffffff;">
                <h1 style="margin:0; font-size:22px;">Blinkeyit</h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px; color:#333333;">
                <p style="font-size:16px;">Hi <strong>${name}</strong>,</p>

                <p style="font-size:15px; line-height:1.6;">
                  We received a request to reset your Blinkeyit account password.
                  Please use the OTP below to proceed.
                </p>

                <!-- OTP Box -->
                <div style="text-align:center; margin:30px 0;">
                  <div
                    style="
                      display:inline-block;
                      background:#f4f6f8;
                      padding:15px 30px;
                      font-size:24px;
                      letter-spacing:6px;
                      font-weight:bold;
                      border-radius:6px;
                      color:#23ac65;
                    "
                  >
                    ${otp}
                  </div>
                </div>

                <p style="font-size:14px; color:#666;">
                  This OTP is valid for a limited time.  
                  Please do not share it with anyone.
                </p>

                <p style="font-size:14px; color:#666;">
                  If you did not request a password reset, you can safely ignore this email.
                </p>

                <p style="font-size:14px; margin-top:30px;">
                  Regards,<br/>
                  <strong>Blinkeyit Team</strong>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px; color:#777;">
                © ${new Date().getFullYear()} Blinkeyit. All rights reserved.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
};

export default forgotPasswordOtpTemplate;
