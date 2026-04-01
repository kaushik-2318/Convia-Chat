const resetPasswordTemplate = (data) =>
    `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Oh Look, Another Reset</title>
  <style type="text/css">
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
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
    .btn-support {
      background: linear-gradient(135deg, #6366f1, #a855f7) !important;
      transition: transform 0.2s ease !important;
    }
    .btn-support:hover {
      transform: scale(1.03) !important;
    }
    .bar-fill-support {
      background: linear-gradient(90deg, #6366f1, #ec4899) !important;
      animation: loading 2s ease-out !important;
    }
    @keyframes loading {
      from { width: 0%; }
      to { width: 85%; }
    }
    a {
      text-decoration: none;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; -webkit-font-smoothing: antialiased;">
  
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 40px 10px;">
    <tr>
      <td align="center">
        
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 450px; background-color: #0f172a; border-radius: 20px; border: 1px solid #1e293b; overflow: hidden; margin: 0 auto;">
          
          <tr>
            <td align="center" style="background-color: #6366f1; color: #000000; font-size: 10px; font-weight: 900; letter-spacing: 1px; padding: 8px 0;">
              OFFICIAL SECURITY CLEARANCE: PENDING
            </td>
          </tr>

          <tr>
            <td align="center" style="padding: 40px;">
              
              <div style="margin-bottom: 30px;">
                <a href="https://conviachat.vercel.app" target="_blank">
                  <img src="https://conviachat.vercel.app/favicon.ico" alt="Convia Logo" width="100" style="display: block; border: 0; margin: 0 auto;" onerror="this.src='https://via.placeholder.com/100x40/6366f1/ffffff?text=CONVIA'">
                </a>
              </div>

              <h1 class="gradient-text-support" style="color: #a855f7; font-size: 26px; font-weight: 800; text-align: center; margin: 0 0 15px 0; line-height: 1.2;">
                Memory is a fickle thing, isn't it?
              </h1>

              <p style="text-align: center; font-size: 15px; color: #94a3b8; line-height: 1.6; margin: 0 0 30px 0;">
                Hey ${data.name},<br><br>
                It’s okay. Remembering 12 characters, a special symbol, and a capital letter is a lot to ask of a human in 2026.
                We’ve paused our "very important" work just to help you back in.
              </p>

              <div style="text-align: center; margin-bottom: 15px;">
                <a href="${data.link}" class="btn-support" style="display: inline-block; background-color: #6366f1; color: #ffffff; padding: 16px 32px; border-radius: 12px; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; text-decoration: none;">
                  Reset the password you'll forget anyway
                </a>
              </div>

              <p style="font-style: italic; font-size: 11px; color: #475569; text-align: center; margin: 0 0 30px 0;">
                This link expires in 15 minutes. Please try to be faster than your memory was.
              </p>

              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin: 0 0 35px 0;">
                <tr>
                  <td style="border-top: 1px solid #475569; opacity: 0.3;"></td>
                </tr>
              </table>

              <div style="background-color: #020617; padding: 15px; border-radius: 12px; border: 1px solid #1e293b; text-align: left; margin-bottom: 30px;">
                <div style="font-size: 10px; color: #475569; font-weight: 700; text-transform: uppercase; margin-bottom: 4px;">Task Difficulty for most people: 2/10</div>
                <div style="font-size: 10px; color: #475569; font-weight: 700; text-transform: uppercase; margin-bottom: 8px;">Task Difficulty for you right now:</div>
                <div style="height: 6px; background-color: #1e293b; width: 100%; border-radius: 10px; overflow: hidden;">
                  <div class="bar-fill-support" style="height: 100%; width: 85%; background-color: #a855f7; border-radius: 10px;"></div>
                </div>
              </div>

              <div style="font-size: 12px; color: #64748b; line-height: 1.5; text-align: center;">
                <p style="margin: 0 0 10px 0;">
                  Didn’t request this? Then someone else is currently failing to guess your cat's name. How exciting. You can safely ignore this.
                </p>
                <p style="margin: 0;">
                  Problems? Reach us at <a href="mailto:${data.email}" style="color: #a855f7; text-decoration: none; font-weight: 600;">${data.email}</a> (We'll try to keep the sighs to a minimum).
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

export default resetPasswordTemplate;
