const otpMailTemplate = (data) =>
    `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Prove You Are You</title>
  <style type="text/css">
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
    body {
      margin: 0;
      padding: 0;
      background-color: #ffffff;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .gradient-text-support {
      background: linear-gradient(to right, #6366f1, #a855f7, #ec4899);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent !important;
    }
    .otp-number:hover {
      border-color: #ec4899 !important;
    }
    a {
      color: #6366f1;
      text-decoration: none;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; -webkit-font-smoothing: antialiased;">
  
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 40px 10px;">
    <tr>
      <td align="center">
        
        <table width="100%" max-width="500" border="0" cellpadding="0" cellspacing="0" style="max-width: 500px; background-color: #0f172a; border-radius: 24px; border: 1px solid #1e293b; overflow: hidden; margin: 0 auto;">
          
          <tr>
            <td align="center" style="background-color: #ec4899; color: #ffffff; font-size: 10px; font-weight: 900; letter-spacing: 2px; padding: 6px 0;">
              IDENTITY DOUBT: HIGH
            </td>
          </tr>

          <tr>
            <td align="center" style="padding: 40px;">
              
              <div style="font-size: 14px; text-transform: uppercase; letter-spacing: 3px; color: #475569; margin-bottom: 20px;">
                Convia Chat Protocol
              </div>
              
              <div style="margin-bottom: 30px;">
                <a href="https://conviachat.vercel.app/" target="_blank">
                  <img src="https://conviachat.vercel.app/favicon.ico" alt="Logo" width="90" style="display: block; border: 0; margin: 0 auto;" onerror="this.src='https://via.placeholder.com/80/6366f1/ffffff?text=C'">
                </a>
              </div>

              <h1 class="gradient-text-support" style="color: #a855f7; font-size: 28px; font-weight: 800; text-align: center; margin: 0 0 10px 0;">
                Are you actually ${data.name}?
              </h1>
              
              <p style="text-align: center; font-size: 15px; color: #94a3b8; line-height: 1.6; margin: 0 0 35px 0;">
                The internet is a scary place, and we're not entirely convinced you're who you say you are. Please enter these numbers so we can continue pretending our security is impenetrable.
              </p>

              <div style="text-align: center; margin-bottom: 30px;">
                ${data.otp
                    .split('')
                    .map(
                        (digit) =>
                            `<span class="otp-number" style="display: inline-block; font-size: 28px; font-weight: 800; color: #ffffff; background-color: #1e1b4b; border: 1px solid #1e293b; border-radius: 12px; width: 50px; height: 60px; line-height: 60px; text-align: center; margin: 0 5px;">${digit}</span>`,
                    )
                    .join('')}
              </div>

              <div style="background-color: #020617; padding: 15px; border-radius: 12px; font-size: 13px; color: #475569; font-style: italic; border-left: 3px solid #a855f7; text-align: left;">
                Hurry up. These numbers will expire in 5 minutes, much like our patience for manual verifications.
              </div>

              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td style="border-top: 1px solid #475569; opacity: 0.4;"></td>
                </tr>
              </table>

              <div style="text-align: center; font-size: 12px; color: #64748b; line-height: 1.6;">
                <p style="margin: 0 0 10px 0;">If you didn't request this, congratulations! Someone else is trying to be you. You should probably be worried, but you can also just ignore this.</p>
                <p style="margin: 0;">
                  Help: <a href="mailto:${data.email}" style="color: #6366f1; text-decoration: none; font-weight: 600;">${data.email}</a>
                </p>
              </div>

            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`;

export default otpMailTemplate;
