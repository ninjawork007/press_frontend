import NextAuth from "next-auth";
import AppleProvider from "next-auth/providers/apple";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";

import axios from "axios";
import API from "../../../lib/api";
import jwt_decode from "jwt-decode";
import moment from "moment";

export default async function handler(req, res) {
  return NextAuth(req, res, {
    secret: process.env.SECRET,
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
      CredentialsProvider({
        name: "Email",
        credentials: {
          email: { label: "Email", type: "text" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          /**
           * This function is used to define if the user is authenticated or not.
           * If authenticated, the function should return an object contains the user data.
           * If not, the function should return `null`.
           */
          if (credentials == null) return null;
          /**
           * credentials is defined in the config above.
           * We can expect it contains two properties: `email` and `password`
           */
          try {
            const { data } = await API.auth.signIn({
              email: credentials.email,
              password: credentials.password,
            });

            const { user, jwt } = data;

            const userData = await API.users
              .get({ id: user.id, jwt })
              .then(function (result) {
                return result.data;
              })
              .catch((err) => {
                console.log(err);
                return {};
              });

            return { ...user, jwt, ...userData };
          } catch (error) {
            // Sign In Fail
            console.log(error);
            return null;
          }
        },
      }),
    ],
    database: process.env.NEXT_PUBLIC_DATABASE_URL,
    session: {
      jwt: true,
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
      async session({ session, token, user }) {
        //The session callback is called whenever a session is checked.

        //check if jwt is valid
        if (token.jwt) {
          var decoded = jwt_decode(token.jwt);
          const expDate = moment(decoded.exp * 1000);
          var currentTime = moment();

          if (currentTime.isAfter(expDate)) {
            //if jwt is expired, log out via rest API
            await axios.post(`/api/auth/signout`, {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            });
          }
        }
        session.jwt = token.jwt;
        session.id = token.id;
        session.profile = token.profile;
        if (token.user) {
          //if JWT callback includes updated user info, update session
          session.user.email = token.user?.email;
        }
        session.role = token.role;
        return session;
      },
      async jwt({ token, user, account }) {
        //This callback is called whenever a JSON Web Token is created (i.e. at sign in) or updated (i.e whenever a session is accessed in the client)
        const isSignIn = user ? true : false;
        const isUpdate = req.url === "/api/auth/session?update";

        if (isUpdate) {
          const userData = await API.users
            .get({ id: token.id, jwt: token.jwt })
            .then(function (result) {
              return result.data;
            })
            .catch((err) => {
              console.log(err);
              return {};
            });
          token.user = userData;
          token.profile = userData.profile;
          token.role = userData.role?.name;
        } else if (isSignIn) {
          if (account.provider !== "credentials") {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/auth/${account.provider}/callback?access_token=${account?.access_token}`
            );

            const data = await response.data;
            token.jwt = data.jwt;
            token.id = data.user.id;
          } else {
            token.id = user.id;
            token.jwt = user.jwt;
            token.role = user.role?.name;
            token.profile = user.profile;
          }
        }

        return token;
      },
    },
  });
}
