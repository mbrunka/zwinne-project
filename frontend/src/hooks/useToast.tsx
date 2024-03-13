import { useToast, UseToastOptions } from "@chakra-ui/react";
import { useMemo } from "react";

type ToastPromiseParams = {
  pending?: string;
  success?: string;
  error?: string;
  errorKeys?: { [x in string]: string };
};

export const useToastPromise = (options?: UseToastOptions) => {
  const toast = useToast(options);
  const handlePromise = (promise: any, params: ToastPromiseParams = {}) => {
    const {
      pending = "Saving...",
      success = "Data saved",
      error = "An error occurred while saving data",
    } = params;
    const toastId = toast({
      status: "info",
      description: pending,
      duration: null,
    });

    const errorKeys = {
      ...params.errorKeys,
      LoggedOut: "The user has been logged out. Try logging in again.",
      ServerError:
        "There is a problem on the server side. Please try again later.",
    };

    return promise
      .then((result) => {
        toast.update(toastId, {
          status: "success",
          description: success,
          duration: 5000,
        });
        return result;
      })
      .catch((result) => {
        toast.update(toastId, {
          status: "error",
          description: errorKeys[result?.response?.data] || error,
          duration: 5000,
        });
        return result;
      });
  };

  return useMemo(() => ({ promise: handlePromise }), []);
};
