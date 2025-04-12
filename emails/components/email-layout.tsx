import type * as React from "react"

interface EmailLayoutProps {
  children: React.ReactNode
}

export const EmailLayout: React.FC<EmailLayoutProps> = ({ children }) => {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>WAGA Academy</title>
        <style>
          {`
            /* Base styles */
            body {
              background-color: #f8f9fa;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              -webkit-font-smoothing: antialiased;
              font-size: 16px;
              line-height: 1.4;
              margin: 0;
              padding: 0;
              -ms-text-size-adjust: 100%;
              -webkit-text-size-adjust: 100%;
            }
            
            table {
              border-collapse: separate;
              width: 100%;
            }
            
            table td {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              font-size: 16px;
              vertical-align: top;
            }
            
            /* Layout */
            .email-wrapper {
              background-color: #f8f9fa;
              margin: 0;
              padding: 0;
              width: 100%;
            }
            
            .email-content {
              margin: 0 auto;
              max-width: 580px;
              padding: 10px;
            }
            
            /* Header */
            .email-header {
              padding: 20px 0;
              text-align: center;
            }
            
            .email-header img {
              max-width: 180px;
              height: auto;
            }
            
            /* Body */
            .email-body {
              background-color: #ffffff;
              border: 1px solid #e9e9e9;
              border-radius: 12px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
              margin: 0;
              padding: 0;
              width: 100%;
            }
            
            .email-body-inner {
              padding: 30px;
            }
            
            .email-footer {
              clear: both;
              color: #9a9ea6;
              font-size: 12px;
              margin: 0 auto;
              max-width: 580px;
              padding: 20px 0;
              text-align: center;
              width: 100%;
            }
            
            .email-footer p {
              color: #9a9ea6;
              font-size: 12px;
              text-align: center;
            }
            
            /* Typography */
            h1, h2, h3 {
              color: #171923;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              font-weight: 700;
              line-height: 1.4;
              margin: 0 0 15px;
            }
            
            h1 {
              font-size: 28px;
              text-align: center;
              letter-spacing: -0.5px;
            }
            
            h2 {
              font-size: 22px;
            }
            
            h3 {
              font-size: 18px;
            }
            
            p {
              color: #4a5568;
              font-size: 16px;
              line-height: 1.6;
              margin: 0 0 15px;
            }
            
            /* Buttons */
            .btn {
              box-sizing: border-box;
              display: inline-block;
              min-width: 100px;
              padding: 12px 20px;
              margin: 0;
              color: #ffffff;
              background-color: #6b46c1;
              border-radius: 6px;
              text-decoration: none;
              text-align: center;
              font-weight: 600;
              font-size: 16px;
              line-height: 1.2;
            }
            
            .btn-primary {
              background-color: #6b46c1;
              border-top: 10px solid #6b46c1;
              border-right: 18px solid #6b46c1;
              border-bottom: 10px solid #6b46c1;
              border-left: 18px solid #6b46c1;
            }
            
            .btn-green {
              background-color: #38a169;
              border-top: 10px solid #38a169;
              border-right: 18px solid #38a169;
              border-bottom: 10px solid #38a169;
              border-left: 18px solid #38a169;
            }
            
            /* Utilities */
            .align-center {
              text-align: center;
            }
            
            .align-right {
              text-align: right;
            }
            
            .align-left {
              text-align: left;
            }
            
            .clear {
              clear: both;
            }
            
            .mt0 {
              margin-top: 0;
            }
            
            .mb0 {
              margin-bottom: 0;
            }
            
            .preheader {
              color: transparent;
              display: none;
              height: 0;
              max-height: 0;
              max-width: 0;
              opacity: 0;
              overflow: hidden;
              mso-hide: all;
              visibility: hidden;
              width: 0;
            }
            
            .powered-by a {
              color: #9a9ea6;
              font-size: 12px;
              text-decoration: none;
            }
            
            hr {
              border: 0;
              border-bottom: 1px solid #e9e9e9;
              margin: 20px 0;
            }
            
            /* Responsive */
            @media only screen and (max-width: 620px) {
              table.body .email-content {
                width: 100% !important;
              }
              table.body .email-wrapper {
                padding: 0 !important;
              }
              table.body .email-body {
                border-radius: 0 !important;
              }
            }
          `}
        </style>
      </head>
      <body>
        <span className="preheader">
          WAGA Academy - Empowering the future of coffee through Web3 and blockchain technology
        </span>
        <table className="email-wrapper" role="presentation">
          <tr>
            <td>
              <table className="email-content" role="presentation">
                <tr>
                  <td className="email-header">
                    <img src="https://academy.wagatoken.io/logo.png" alt="WAGA Academy" width="180" />
                  </td>
                </tr>
                <tr>
                  <td className="email-body">
                    <table role="presentation">
                      <tr>
                        <td className="email-body-inner">{children}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td className="email-footer">
                    <p>WAGA Academy - Empowering the future of coffee through Web3 and blockchain technology</p>
                    <p>&copy; {new Date().getFullYear()} WAGA Academy. All rights reserved.</p>
                    <p className="powered-by">
                      Website: <a href="https://academy.wagatoken.io">academy.wagatoken.io</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  )
}
