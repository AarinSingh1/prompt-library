import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from '@/lib/db'
import { authConfig } from './auth.config'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  trustHost: true,
  debug: true,
  logger: {
    error(error) {
      // eslint-disable-next-line no-console
      console.error(
        '[auth][full-error]',
        error?.name,
        error?.message,
        '\nstack:',
        error?.stack,
        '\ncause:',
        (error as { cause?: unknown })?.cause,
      )
    },
    warn(code) {
      // eslint-disable-next-line no-console
      console.warn('[auth][warn]', code)
    },
    debug(code, metadata) {
      // eslint-disable-next-line no-console
      console.log('[auth][debug]', code, metadata)
    },
  },
})
