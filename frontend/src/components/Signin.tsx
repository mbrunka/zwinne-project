import {
   Alert,
   AlertIcon,
   Box,
   Button,
   FormControl,
   FormErrorMessage,
   FormLabel,
   Heading,
   Input,
   SimpleGrid,
   Spinner,
   Image
} from '@chakra-ui/react';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AlertMessage from './common/AlertMessage';

type Inputs = {
   email: string;
   password: string;
};

const Signin = (): React.ReactElement => {
   const {
      reset,
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
   } = useForm<Inputs>();
   const [success, setSuccess] = useState(null);
   const [error, setError] = useState(null);
   const session = useSession();
   const router = useRouter();
   const { callbackUrl = '/' } = router.query;

   const errorKeys = {
      WrongCredentials: "Incorrect password or email address",
      NotActivated: "Your account has not been activated yet. We have sent the activation link to your e-mail address again.",
   };

   const onSubmit = async (data: Inputs) => {
      const res = await signIn('credentials', { ...data, redirect: false });

      if (res?.error) {
         setSuccess(false);
         setError(res.error);
      } else {
         setSuccess(true);
         setError(null);
         reset();
         router.push('/');
      }
   };

   useEffect(() => {
      if (typeof callbackUrl !== 'string') return;
      if (session?.status === 'authenticated' && session?.data && callbackUrl)
         router.push(callbackUrl);
   }, [session, callbackUrl, router]);

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
            className={`w-96 ${isSubmitting ? 'opacity-50' : ''}`}
            onSubmit={handleSubmit(onSubmit)}
         >
               <Heading size="md" mb="30px">Sign in</Heading>

            {router?.query?.registered && (
               <AlertMessage
                  status="success"
                  message="Registarion successfull, You can log in now"
               />
            )}

            {error && (
               <Alert
                  status={error === 'NotActivated' ? 'info' : 'error'}
                  mb="20px"
               >
                  <AlertIcon />
                  {errorKeys[error] ?? "Sign in error"}
               </Alert>
            )}

            {success && (
               <Alert status="success" mb="20px">
                  <AlertIcon />
                  Sign in success
               </Alert>
            )}

            <SimpleGrid width="100%" columns={1} spacing="20px">
               <FormControl isRequired isInvalid={!!errors?.email}>
                  <FormLabel>Email</FormLabel>
                  <Input
                     autoFocus
                     {...register('email', {
                        required: true,
                     })}
                  />
                  {!!errors?.email && (
                     <FormErrorMessage>Field required</FormErrorMessage>
                  )}
               </FormControl>

               <FormControl isRequired isInvalid={!!errors?.password}>
                  <FormLabel>Password</FormLabel>
                  <Input
                     {...register('password', {
                        required: true,
                     })}
                     type="password"
                  />
                  {!!errors?.password && (
                     <FormErrorMessage>Field required</FormErrorMessage>
                  )}
               </FormControl>
            </SimpleGrid>

            <Box alignItems="center" mt="20px" display="flex" flexDirection="column">
               <Button maxW="100px" type="submit" className="w-full mt-16">
                  Sign in
               </Button>

               <Button variant="ghost" className="mt-8">
                  <Link href="/signup">Sign up</Link>
               </Button>
               {/* TODO display when forgot-password page ready */}
               {/* <Link href="/forgot-password" className="mt-16 hover:underline">
                  Forgot password
               </Link> */}
            </Box>
         </form>
         </Box>
      </Box>
   );
};

export default Signin;
