import NextAuth from "next-auth";
import Provider from "next-auth/providers";
import { fauna } from '../../../services/faunadb';
import { Collection, Index, query as q } from 'faunadb';

export default NextAuth({
  providers: [
    Provider.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope: 'read:user'
    }),
  ],

  callbacks: {
    async signIn(user) {
      try {
        const userExist = await fauna.query(
          q.Exists(
            q.Match(
              q.Index('by_email_user'),
              q.Casefold(user.email)
            )
          )
        )
        if(userExist) {
          await fauna.query(
            q.Get(
              q.Match(
                q.Index('by_email_user'),
                q.Casefold(user.email)
              )
            )
          )
        }
        if(!userExist) {
          await fauna.query(
            q.Create(
              q.Collection('users'),
              { data: { email: user.email } }
            )
          )
        }

        return true

      } catch {

        return false

      }
    }
  }
})