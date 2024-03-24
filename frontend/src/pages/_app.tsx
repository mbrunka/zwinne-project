import { SettingsProvider } from "@/components/SettingsContext";
import { ChakraProvider, Flex, Spinner } from "@chakra-ui/react";
import { Figtree, Nunito_Sans } from "@next/font/google";
import axios from "axios";
import Cookies from "js-cookie";
import { Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { AppProps } from "next/app";
import getConfig from "next/config";
import { useRouter } from "next/router";
import React from "react";
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
          Authorization: jwtToken,
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

function App({ Component, pageProps }: CustomAppProps) {
  const [session, setSession] = React.useState<Session>(pageProps.session);
  const router = useRouter();
  const { locale, asPath } = router;

  const AuthComponent = Component.auth ? (
    <Auth>
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
            <main className={`${nunitoSans.variable} ${figtree.variable}`}>
              {AuthComponent}
            </main>
          </SWRConfig>
        </SettingsProvider>
      </ChakraProvider>
    </SessionProvider>
  );
}

function Auth({ children }) {
  const { data: session, status } = useSession();
  const jwtToken = Cookies.get("token");
  //@ts-ignore
  const isUser = !!session?.user?.id;
  const router = useRouter();
  const { locale, asPath } = router;

  React.useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!jwtToken) router?.push("/signin"); // If not authenticated, force log in
  }, [status, isUser, jwtToken, router]);

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
