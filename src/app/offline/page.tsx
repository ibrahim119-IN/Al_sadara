import React from 'react'
import Link from 'next/link'

export const metadata = {
  title: 'Offline - Al Sadara',
}

export default function OfflinePage() {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>غير متصل - الصدارة</title>
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 20px;
          }
          .container {
            max-width: 400px;
            text-align: center;
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          }
          .icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 24px;
            color: #6b7280;
          }
          h1 {
            font-size: 24px;
            color: #1f2937;
            margin-bottom: 12px;
          }
          p {
            color: #6b7280;
            margin-bottom: 24px;
            line-height: 1.6;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background: #0066CC;
            color: white;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 600;
            transition: background 0.2s;
          }
          .button:hover {
            background: #0052a3;
          }
          .retry {
            margin-top: 16px;
          }
          .retry button {
            background: none;
            border: none;
            color: #0066CC;
            cursor: pointer;
            font-size: 14px;
            text-decoration: underline;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
          </svg>
          <h1>غير متصل بالإنترنت</h1>
          <p>
            يبدو أنك غير متصل بالإنترنت حالياً.
            <br />
            تحقق من اتصالك وحاول مرة أخرى.
          </p>
          <a href="/" className="button">العودة للرئيسية</a>
          <div className="retry">
            <button onClick={() => window.location.reload()}>
              إعادة المحاولة
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
