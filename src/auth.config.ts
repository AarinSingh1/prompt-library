import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  providers: [],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAuthPage = nextUrl.pathname.startsWith('/login')
      const isApiAuth = nextUrl.pathname.startsWith('/api/auth')

      if (isApiAuth) return true
      if (isAuthPage) return isLoggedIn ? Response.redirect(new URL('/prompts', nextUrl)) : true
      return isLoggedIn
    },
    jwt({ token, user }) {
      if (user?.id) token.id = user.id
      return token
    },
    session({ session, token }) {
      if (token?.id && session.user) session.user.id = token.id as string
      return session
    },
  },
}
