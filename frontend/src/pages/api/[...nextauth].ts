import axios from 'axios';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

interface AuthToken {
   accessToken: string;
   refreshToken: string;
}

interface ServerResponse {
   accessToken: string;
   refreshToken: string;
}

async function refreshAccessToken(token: AuthToken) {
   const refresh = await axios
      .post(`${process.env.API_URL}/auth/refresh`, {
         refreshToken: token.refreshToken,
      })
      .catch(error => {});
   if (refresh && refresh.status === 200 && refresh.data.access) {
      return {
         ...token,
         accessToken: refresh.data.accessToken,
         refreshToken: refresh.data.refreshToken,
         expiresAt: Date.now() + 60 * 60 * 1000,
      };
   }
   return {
      error: 'RefreshAccessTokenError',
   };
}

export default NextAuth({
   providers: [
      CredentialsProvider({
         name: 'Credentials',
         credentials: {
            email: { label: 'Email', type: 'text' },
            password: { label: 'Password', type: 'password' },
         },
         async authorize(credentials) {
            try {
               if (!credentials) throw new Error('No credentials provided!');

               const auth = await axios.post<ServerResponse>(
                  `${process.env.API_URL}/auth/login`,
                  {
                     email: credentials.email,
                     password: credentials.password,
                  }
               );

               if (auth.status === 200 && auth.data.accessToken) {
                  const profile = await axios.get(
                     `${process.env.API_URL}/auth/me/`,
                     {
                        headers: {
                           Authorization: `${auth.data.accessToken}`,
                        },
                     }
                  );

                  if (profile.status === 200 && profile.data) {
                     return {
                        ...profile.data,
                        tokens: auth.data,
                     };
                  }
               }
            } catch (error) {
               throw new Error(error?.response?.data?.message);
            }

            return null;
         },
      }),
   ],
   pages: {
      signIn: `${publicRuntimeConfig.basePath}/signin`,
   },
   callbacks: {
      jwt: async ({ token, user, account }) => {
         if (account && user) {
            return {
               accessToken: user.tokens.accessToken,
               refreshToken: user.tokens.refreshToken,
               expiresAt: Date.now() + 60 * 60 * 1000,
            };
         }

         if (Date.now() < token.expiresAt) {
            return token;
         }

         // @ts-ignore
         if (token) await refreshAccessToken(token);
         return null;
      },
      session: async ({ session, token, ...rest }) => {
         if (token.accessToken) {
            try {
               const profile = await axios.get(
                  `${process.env.API_URL}/auth/me/`,
                  {
                     headers: {
                        Authorization: `${token.accessToken}`,
                     },
                  }
               );

               session.user = profile.data;
            } catch (error) {
               session.user = null;
            }
         }

         session.token = token.accessToken;
         return session;
      },
   },
   session: {
      maxAge: 30 * 24 * 60 * 60,
   },
   debug: false,
});
