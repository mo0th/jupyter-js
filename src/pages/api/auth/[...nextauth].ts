import { __dev__ } from '#src/constants'
import { NextApiHandler } from 'next'
import NextAuth, { InitOptions } from 'next-auth'

import Providers from 'next-auth/providers'

const url = process.env.NEXTAUTH_URL

const options: InitOptions = {
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  session: {
    jwt: true,
  },
  callbacks: {
    async session(session, user) {
      // console.log({ session, user })
      const sessionUser = {
        ...user,
        id: user.id,
        username: user.username,
      }

      return { ...session, user: sessionUser }
    },
    async jwt(token, user, _account, profile) {
      // console.log({ token, user, account, profile, isNew })

      let result = token

      if (user?.id) {
        const id = user.id
        result = { ...token, id, username: profile.login }
      }

      return result
    },
  },
  secret: process.env.SESSION_SECRET,
  jwt: { secret: process.env.JWT_SECRET },
  database: process.env.MONGO_URI,
  debug: __dev__,
}

const handler: NextApiHandler = async (req, res) => {
  res.setHeader('x-url', url)
  await NextAuth(req, res, options)
}

export default handler
