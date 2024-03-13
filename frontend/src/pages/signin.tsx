import { getCsrfToken, getProviders, getSession } from "next-auth/react";
import React from "react";

import CleanLayout from "@/components/Layout/CleanLayout";
import Signin from "@/components/Signin";

const SigninPage = (): React.ReactElement => (
  <CleanLayout>
    <Signin />
  </CleanLayout>
);

export async function getServerSideProps(context) {
  const providers = await getProviders();
  const session = await getSession(context);

  return {
    props: {
      providers,
      session,
    },
  };
}

export default SigninPage;
