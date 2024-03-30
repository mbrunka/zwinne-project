import { getCsrfToken, getProviders, getSession } from "next-auth/react";
import React from "react";

import CleanLayout from "@/components/Layout/CleanLayout";
import Signup from "@/components/Signup";
import TeacherSignup from "@/components/TeacherSignup";

const TeacherSignupPage = (): React.ReactElement => (
  <CleanLayout>
    <TeacherSignup />
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

export default TeacherSignupPage;
