import { useToastPromise } from "@/hooks/useToast";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { mutate } from "swr";

type Inputs = {
  code: string;
};

const JoinProjectFrom = (): React.ReactElement => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();
  const toast = useToastPromise();

  const onSubmit = async (data: Inputs) => {
    return toast.promise(
      axios.post(`/projekty/join`, { joinCode: data?.code }).then(async () => {
        await mutate("/projekty/my");
        reset();
      })
    );
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <Heading size="small">Join project</Heading>
      <FormControl isRequired isInvalid={!!errors?.code}>
        <FormLabel>Code</FormLabel>
        <Input
          autoFocus
          {...register("code", {
            required: true,
          })}
        />
        {!!errors?.code && <FormErrorMessage>Field required</FormErrorMessage>}
      </FormControl>
      <Button
        marginY={5}
        isLoading={isSubmitting}
        isDisabled={isSubmitting}
        type="submit"
      >
        Join
      </Button>
    </form>
  );
};

export default JoinProjectFrom;
