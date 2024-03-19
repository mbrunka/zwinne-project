import { getCsrfToken, getProviders, getSession } from "next-auth/react";
import React from "react";

import CleanLayout from "@/components/Layout/CleanLayout";
import Signup from "@/components/Signup";

const SignupPage = (): React.ReactElement => (
  <CleanLayout>
    <Signup />
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

export default SignupPage;
