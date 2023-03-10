import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export default NextAuth({
  // secret: process.env.SECRET,
  // site: process.env.NEXTAUTH_URL,
  providers: [
    // OAuth authentication providers
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },

  callbacks: {
    //adding more properties to session.user
    async session({ session, token, user }) {
      session.user.username = session.user.name.split(" ").join('.').toLocaleLowerCase()
      session.user.uid = token.sub

      return session
    }
  }
})






