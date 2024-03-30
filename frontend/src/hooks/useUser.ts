import { useSettings } from "@/components/SettingsContext";
import { signOut } from "@/utils/signOut";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { mutate } from "swr";
import { useStaleSWR } from "./useStaleSWR";

export const mutateSession = (
  data?: Session,
  shouldRevalidate?: boolean
): Promise<any> => mutate("/auth/me", data, shouldRevalidate);

export function useUser({ redirectTo = null, redirectIfFound = false } = {}): [
  session: Session,
  isLoading: boolean,
  isError: boolean
] {
  const { data: nextSession, status: loading } = useSession();
  const { settings } = useSettings();
  const router = useRouter();

  const {
    data: session,
    isValidating,
    error,
  } = useStaleSWR(nextSession?.user?.id ? "/auth/me" : null);

  useEffect(() => {
    if (session?.currentRole?.id !== nextSession?.currentRole?.id) {
      settings.setSession(session);
    }
  }, [session]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    if (!error || !session?.currentRole?.id) return;
    // await axios.post("/logout");
    signOut()
    router.push("/signin");
  }, [error, router, session?.currentRole?.id]);

  const isLoading = !!loading || (!session && isValidating);
  const hasSession = Boolean(session?.user);

  useEffect(() => {
    if (!redirectTo || isLoading) return;
    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !hasSession) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && hasSession)
    ) {
      router.push(redirectTo);
    }
  }, [redirectTo, redirectIfFound, hasSession, isLoading]);

  return [session || nextSession, isLoading, !!error];
}
