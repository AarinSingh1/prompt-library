import { NextRequest } from 'next/server'

/**
 * Standalone error page handler.
 * Takes precedence over [...nextauth] for /api/auth/error requests.
 * This prevents NextAuth's own error-page renderer from crashing the request.
 */
export async function GET(req: NextRequest) {
  const error = req.nextUrl.searchParams.get('error') ?? 'Unknown'
  console.log('[auth-error-page] error:', error, 'url:', req.url)

  const errorMessages: Record<string, string> = {
    Configuration: 'There is a problem with the server configuration. Check that GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and AUTH_SECRET / NEXTAUTH_SECRET are set correctly in Vercel.',
    AccessDenied: 'Access was denied.',
    Verification: 'The sign-in link is no longer valid.',
    OAuthSignin: 'Error starting the OAuth sign-in flow.',
    OAuthCallback: 'Error handling the OAuth callback.',
    OAuthCreateAccount: 'Error creating an OAuth account.',
    EmailCreateAccount: 'Error creating an email account.',
    Callback: 'Error in the OAuth callback.',
    OAuthAccountNotLinked: 'This account is already linked to a different sign-in method.',
    EmailSignin: 'Error sending the email sign-in link.',
    CredentialsSignin: 'Invalid credentials.',
    SessionRequired: 'Please sign in to access this page.',
    CallbackRouteError: 'An error occurred during sign-in. Check Vercel logs for details.',
    Default: 'An error occurred.',
  }

  const message = errorMessages[error] ?? errorMessages.Default

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sign In Error</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .card { background: white; border-radius: 12px; padding: 40px; max-width: 440px; width: 90%; box-shadow: 0 4px 24px rgba(0,0,0,0.08); text-align: center; }
    h1 { font-size: 22px; color: #1a1a1a; margin: 0 0 12px; }
    p { color: #666; font-size: 15px; line-height: 1.5; margin: 0 0 24px; }
    .error-code { font-size: 12px; color: #999; background: #f5f5f5; border-radius: 6px; padding: 4px 8px; display: inline-block; margin-bottom: 24px; }
    a { display: inline-block; background: #0070f3; color: white; text-decoration: none; padding: 10px 24px; border-radius: 8px; font-size: 15px; }
    a:hover { background: #0060df; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Sign-in Error</h1>
    <p>${message}</p>
    <div class="error-code">Error: ${error}</div><br/>
    <a href="/login">Try again</a>
  </div>
</body>
</html>`

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
