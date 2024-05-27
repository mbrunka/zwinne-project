import {
    Button,
    Flex,
    Heading,
    Input,
    Text,
    InputLeftAddon,
    InputGroup,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    FormErrorMessage,
    FormControl, FormLabel, useToast,
} from '@chakra-ui/react';
import Layout from '../components/Layout';
import React, {useState} from "react";
import axios from "axios";
import { isEmail, isStrongPassword } from "validator";
import {useForm} from "react-hook-form";
import {getCurrentToken} from "@/utils/cookies";
import {ButtonGroup} from "chakra-ui";
import {signOut} from "@/utils/signOut";
import {router} from "next/client";

type Inputs = {
    email: string;
    password: string;
}

const SettingsPage = () => {
    const toast = useToast();


    const [showConfirmation, setShowConfirmation] = useState(false);

    const {
        control,
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
     } = useForm<Inputs>();

    const onChangeEmailSubmit = (data: Inputs) => {
        const dataToSend = {
            newEmail: data.email,
            password: data.password,
        };
        // console.log(dataToSend);
        setShowConfirmation(false);

        axios.post("user/changeEmail", {
            ...dataToSend,
        }, {
            headers: {
                Authorization: `Bearer ${getCurrentToken()}`,
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    toast({
                        title: 'Successfully changed the email',
                        description: "You will be logged out in 3 seconds",
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                    })
                    logoutIn(3000);
                }
            })
            .catch((error) => {
                // console.log("Jestem w error");
                console.log(error);
                const response = error.response;
                const message = response.data;
                toast({
                    title: `Error (${response.status})`,
                    description: message,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            })
    }

    function logoutIn(timeMs: number) {
        setTimeout(() => {
            signOut();
            router.push("/signin");
        }, timeMs)
    }

    return (
        <Layout>
            <Heading marginBottom="40px" textAlign="center">Settings</Heading>

            <form
                noValidate
                onSubmit={handleSubmit(onChangeEmailSubmit)}
                className={`w-[32rem] ${isSubmitting ? "opacity-50" : ""}`}
            >
            <InputGroup>
                <FormControl isRequired isInvalid={!!errors?.email}>
                <FormLabel marginBottom="20px" fontSize="30">Change e-mail address</FormLabel>
                <InputLeftAddon backgroundColor="#FFE5CC" width="160px" height="45px" fontSize="15" marginBottom="20px" paddingLeft="10px" float="left">New e-mail address</InputLeftAddon>
                <Input marginBottom="20px" width="500px" height="45px" size='sm' float="left"
                       {...register("email", {
                           required: true,
                           validate: (value: string) =>
                               isEmail(value) || "Invalid email address",
                       })}
                ></Input>
                {errors?.email?.type != "validate" && (
                    <FormErrorMessage>Field required</FormErrorMessage>
                )}
                {errors?.email?.type == "validate" && (
                    <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
                )}
                </FormControl>

            </InputGroup>
            <InputGroup>
                <InputLeftAddon backgroundColor="#FFE5CC" width="160px" height="45px" fontSize="15" marginBottom="20px" paddingLeft="10px">Password </InputLeftAddon>
                <Input type="password" marginBottom="20px" width="500px" height="45px"size='sm'
                       {...register("password", {
                           required: true,
                       })}
                ></Input>
            </InputGroup>

        {/*<InputGroup width="160px" height="40px">*/}
        {/*<ButtonGroup width="160px" height="40px" fontSize="xs" wordBreak="normal" letterSpacing="normal" lineHeight="normal" as={}>*/}
            <Button marginBottom="160px" width="160px" height="40px" onClick={() => setShowConfirmation(true)}>Change</Button>
                {showConfirmation && <> <Button type="submit">Confirm</Button>  <Button onClick={() => setShowConfirmation(false)}>No</Button> </>}
        {/*</ButtonGroup>*/}
        {/*</InputGroup>*/}

                </form>


            <Flex direction="column" width="100%" alignItems="center" gap={5} mt="15vh">
            </Flex>
        </Layout>

    );
};

const isMailAnMail = () => {

};

const isNewPasswordRepeated = () => {
    // const [settings_new_password, set_settings_new_password] = useState('')
    // let settings_new_password_check: Object = valueOf(settings_new_password_check) ;
    // let settings_new_password
    // if (settings_new_password == settings_new_password_check) {
    //
    // }
};


export default SettingsPage;