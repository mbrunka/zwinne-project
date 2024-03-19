import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Image,
  Input,
  Link,
  SimpleGrid,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { isEmail, isStrongPassword } from "validator";
import AlertMessage from "./common/AlertMessage";

type Inputs = {
  username: string;
  email: string;
  password: string;
  passwordRepeat: string;
};

const Signup = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const [error, setError] = useState(null);
  const router = useRouter();

  const onSubmit = async (data: Inputs) => {
    if (data.password != data.passwordRepeat) {
      setError("DifferentPasswords");
      return;
    }

    const dataToSend = {
      username: data.username,
      email: data.email,
      password: data.password,
    };

    await axios
      .post("/user/admin", {
        ...dataToSend,
      })
      .then(async () => {
        setError(null);
        router.push({
          pathname: "/signin",
          query: { registered: true },
        });
      })
      .catch((error) => {
        setError(error?.response?.data?.message);
      });
  };

  return (
    <Box width="100%" paddingTop="40px" display="flex" justifyContent="center">
      <Box width="70%" maxW="500px" display="flex" flexDirection="column">
        <Image
          height="300px"
          objectFit="contain"
          src={`/logo.png`}
          alt="Logo"
        />
        {isSubmitting ? (
          <div className="absolute w-full h-full z-10 flex justify-center items-center">
            <Spinner size="xl" />
          </div>
        ) : null}

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className={`w-[32rem] ${isSubmitting ? "opacity-50" : ""}`}
        >
          <Heading size="md" mb="30px">
            Sign up
          </Heading>

          {error && <AlertMessage status="error" message="Sing up error" />}

          <SimpleGrid columns={2} width="100%" spacingX="1rem" spacingY="2rem">
            <FormControl isRequired isInvalid={!!errors?.email}>
              <FormLabel>Username</FormLabel>
              <Input
                autoFocus
                {...register("username", {
                  required: true,
                  validate: (value) => value.length > 2 || "Wrong username",
                })}
              />
              {!!errors?.username && (
                <FormErrorMessage>Field required</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isRequired isInvalid={!!errors?.email}>
              <FormLabel>Email</FormLabel>
              <Input
                {...register("email", {
                  required: true,
                  validate: (value) =>
                    isEmail(value) || "Invalid email address",
                })}
              />
              {!!errors?.email && (
                <FormErrorMessage>Field required</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isRequired isInvalid={!!errors?.password}>
              <FormLabel>Password</FormLabel>
              <Input
                {...register("password", {
                  required: true,
                  validate: (value) =>
                    isStrongPassword(value) ||
                    "The password should be at least 8 characters long and contain at least one uppercase letter, a lowercase letter, a number and a special character.",
                })}
                type="password"
              />
              {errors?.password?.type != "validate" && (
                <FormErrorMessage>Field required</FormErrorMessage>
              )}
              {errors?.password?.type == "validate" && (
                <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isRequired isInvalid={!!errors?.passwordRepeat}>
              <FormLabel>Repeat password</FormLabel>
              <Input
                {...register("passwordRepeat", {
                  required: true,
                })}
                type="password"
              />
              {!!errors?.passwordRepeat && (
                <FormErrorMessage>Field required</FormErrorMessage>
              )}
            </FormControl>
          </SimpleGrid>

          <Box marginTop="20px">
            <FormControl isRequired isInvalid={!!errors?.regulationsAccepted}>
              <Flex>
                <Controller
                  name="regulationsAccepted"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => <Checkbox {...field} />}
                />

                <FormLabel variant="simple">
                  {"I accept "}
                  <Link target="_blank" href="">
                    SERVICE REAGULATIONS
                  </Link>
                </FormLabel>
              </Flex>
              {!!errors?.regulationsAccepted && (
                <FormErrorMessage>Field required</FormErrorMessage>
              )}
            </FormControl>

            <FormControl
              isRequired
              mt="0.5rem"
              isInvalid={!!errors?.privacyPolicyAccepted}
            >
              <Flex>
                <Controller
                  name="privacyPolicyAccepted"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => <Checkbox {...field} />}
                />
                <FormLabel variant="simple">
                  {"I accept "}
                  <Link target="_blank" href="">
                    PRIVACY POLICY
                  </Link>
                </FormLabel>
              </Flex>

              {!!errors?.privacyPolicyAccepted && (
                <FormErrorMessage>Field required</FormErrorMessage>
              )}
            </FormControl>
          </Box>

          <Box
            alignItems="center"
            mt="20px"
            display="flex"
            flexDirection="column"
          >
            <Button type="submit" className="w-full mt-16">
              Sign up
            </Button>

            <Button
              variant="ghost"
              onClick={() => router.push("/signin")}
              className="mt-8"
            >
              Sign in
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Signup;
