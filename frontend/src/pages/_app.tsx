import { SettingsProvider } from "@/components/SettingsContext";
import { getCurrentRole, setTokenCookie } from "@/utils/cookies";
import { ChakraProvider, Flex, Spinner } from "@chakra-ui/react";
import { Figtree, Nunito_Sans } from "@next/font/google";
import axios from "axios";
import Cookies from "js-cookie";
import { Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { AppProps } from "next/app";
import getConfig from "next/config";
import { useRouter } from "next/router";
import React, { createContext, useState } from "react";
import { SWRConfig } from "swr";
import "../styles/global.scss";
import theme from "../theme";

const nunitoSans = Nunito_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  style: ["italic", "normal"],
  variable: "--font-nunito-sans",
});

const figtree = Figtree({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  style: ["italic", "normal"],
  variable: "--font-figtree",
});

const { publicRuntimeConfig } = getConfig();

axios.defaults.baseURL = `${publicRuntimeConfig.apiUrl}`;

axios.interceptors.request.use(async (config) => {
  const jwtToken = Cookies.get("token");

  const axiosHeaders =
    jwtToken?.length > 0
      ? {
          ...config.headers,
          Authorization: `Bearer ${jwtToken}`,
          "X-API-Key": publicRuntimeConfig.apiKey,
          "Content-Type": "application/json",
        }
      : {
          ...config.headers,
          "X-API-Key": publicRuntimeConfig.apiKey,
          "Content-Type": "application/json",
        };

  config.headers = axiosHeaders;

  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is due to token expiration
    if (error?.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Attempt to refresh the token
      try {
        const refreshToken = Cookies.get("refreshToken");
        const email = Cookies.get("email");
        const response = await axios.post(
          `${publicRuntimeConfig.apiUrl}/auth/refresh`,
          { email: email, refreshToken: refreshToken }
        );

        // If refresh token is successful, update tokens
        if (response.data?.accessToken) {
          const { authToken, refreshToken } = response.data;

          // Update tokens in cookies
          setTokenCookie(authToken, refreshToken,email);

          // Retry the original request with new token
          originalRequest.headers.Authorization = authToken;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        // Handle token refresh error here
      }
    }

    return Promise.reject(error);
  }
);

export const fetcher = (url: string) => axios.get(url).then((res) => res.data);

interface CustomAppProps extends Omit<AppProps, "Component"> {
  Component: AppProps["Component"] & {
    Layout?: JSX.Element;
    auth?: boolean;
  } & any;
}
const settings = {
  menuCollapsed: null,
};

export const CurrentUserContext = createContext<{
  email: string;
  setUserEmail: (email: string) => void;
}>({
  email: "",
  setUserEmail: () => {},
});

function App({ Component, pageProps }: CustomAppProps) {
  const [session, setSession] = React.useState<Session>(pageProps.session);
  const [userEmail, setUserEmail] = useState<string>("");

  const contextValue = {
    email: userEmail,
    setUserEmail,
  };

  const AuthComponent = Component.auth ? (
    <Auth roles={Component?.roles}>
      <Component {...pageProps} />
    </Auth>
  ) : (
    <Component {...pageProps} />
  );

  return (
    <SessionProvider
      session={session}
      basePath={`${publicRuntimeConfig.basePath}/api/auth`}
    >
      <ChakraProvider resetCSS theme={theme}>
        <SettingsProvider initialData={{ ...settings, setSession }}>
          <SWRConfig
            value={{
              fetcher,
              revalidateOnFocus: false,
            }}
          >
            <CurrentUserContext.Provider value={contextValue}>
              <main className={`${nunitoSans.variable} ${figtree.variable}`}>
                {AuthComponent}
              </main>{" "}
            </CurrentUserContext.Provider>
          </SWRConfig>
        </SettingsProvider>
      </ChakraProvider>
    </SessionProvider>
  );
}

function Auth({
  roles,
  children,
}: {
  roles?: string[];
  children: React.ReactElement;
}) {
  const { data: session, status } = useSession();
  const jwtToken = Cookies.get("token");
  //@ts-ignore
  const isUser = !!session?.user?.id;
  const router = useRouter();
  const { locale, asPath } = router;
  const role = getCurrentRole();

  React.useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!!jwtToken && asPath == "/signin") router?.push("/");
    if (!jwtToken && asPath != "/signin") router?.push("/signin"); // If not authenticated, force log in
    if (role == "KANDYDAT_N" && asPath != "/candidate-info")
      router?.push("/candidate-info");
    if (roles && roles?.length > 0 && !roles.includes(role)) {
      router?.push("/");
    }
  }, [status, isUser, jwtToken, router, role, asPath, roles]);

  if (jwtToken) {
    return children;
  }

  // Session is being fetched, or no user.
  return (
    <ChakraProvider>
      <Flex justifyContent="center" p={20}>
        <Spinner size="xl" />
      </Flex>
    </ChakraProvider>
  );
}

export default App;
