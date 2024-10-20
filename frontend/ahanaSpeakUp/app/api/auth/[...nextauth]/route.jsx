import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log(user);

      const encryptedEmail = user.email;
      try {
        console.log(API_URL);
        const productionMode = process.env.NODE_ENV === 'production';
        const BASE_URL = productionMode
          ? 'https://future-prod-endpoint.com/api/speak/up/prod'
          : `${API_URL}/user`;

        let response;

        if (productionMode) {
          response = await axios.post(
            `${BASE_URL}`,
            {},
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          return true;
        } else {
          response = await axios.post(
            `${BASE_URL}/fetch`,
            { encryptedEmail }, // Send the encryptedEmail in the request body
            {
              headers: {
                'Content-Type': 'application/json',
              },
              withCredentials: true,
            }
          );
          return true;
        }
      } catch (error) {
        // Check if the error is a 404 (user not found)
        if (error.response && error.response.status === 404) {
          try {
            const productionMode = process.env.NODE_ENV === 'production';
            const BASE_URL = productionMode
              ? 'https://future-prod-endpoint.com/api/speak/up/prod'
              : `${API_URL}/user/create/user`;

            // User does not exist, create a new user
            const response = await axios.post(
              `${BASE_URL}`,
              {
                fullName: user.name,
                email: user.email,
              }, // Send user data to create a new user
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );

            if (response.status === 200) {
              console.log("USER CREATED - SIGN NEXTAUTH.js");
              return true;
            } else {
              console.error("User creation failed: ", response.status);
              return '/?error=We encountered an error while creating your account. Please refresh the page or click the retry button to try again later';
            }
          } catch (createError) {
            console.error("Error during user creation: ", createError.response ? createError.response.data : createError.message);
            return '/?error=We encountered an error while creating your account. Please refresh the page or click the retry button to try again later';
          }
        } else {
          // Handle other errors
          console.error("Error during user check: ", error.response ? error.response.data : error.message);
          return '/?error=An error occurred while checking user information. Please refresh the page or click the retry button to try again later';
        }
      }
    },
    async jwt({ token, user }) {
      // Persist the user ID in the token
      if (user?._id) {
        token.userId = user._id.toString(); // Store user._id in the token as userId
      }
      return token;
    },
    async session({ session, token }) {
      // Expose the userId in the session object
      if (token?.userId) {
        session.userId = token.userId;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
});

export { handler as GET, handler as POST };

