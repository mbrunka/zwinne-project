import { Alert, AlertDescription, AlertIcon } from "@chakra-ui/react";

const AlertMessage = ({ status, message, ...rest }) => {
  return (
    <Alert
      status={status}
      {...rest}
      bg={
        status == "success"
          ? "green.500"
          : status == "error"
          ? "red.700"
          : "gray.600"
      }
      color={status == "error" ? "white" : undefined}
    >
      <AlertIcon />
      <AlertDescription color={status === "info" ? "white" : "gray.900"}>
        {message}
      </AlertDescription>
    </Alert>
  );
};

export default AlertMessage;
