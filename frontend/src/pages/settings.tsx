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
import {useRouter} from "next/router";

type InputsChangeEmail = {
    newEmail: string;
    password: string;
}

type InputsChangePassword = {
    oldPassword: string;
    newPassword: string;
    repeatNewPassword: string;
}

const SettingsPage = () => {
    const toast = useToast();
    const router = useRouter();


    const [showConfirmationEmail, setShowConfirmationEmail] = useState(false);
    const [showConfirmationPassword, setShowConfirmationPassword] = useState(false);

    const formEmail = useForm<InputsChangeEmail>();
    const formEmailState = formEmail.formState;

    const formPassword = useForm<InputsChangePassword>();
    const formPasswordState = formPassword.formState;

    const onChangePasswordSubmit = (data: InputsChangePassword) => {
        if (data.newPassword !== data.repeatNewPassword) {
            // console.log("Jestem w error");
            //console.log(error);
            setShowConfirmationPassword(false);
            toast({
                title: `Validation error`,
                description: "New passwords don't match",
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        const dataToSend = {
            oldPassword: data.oldPassword,
            newPassword: data.newPassword,
        };

        axios.post("user/changePassword", {
            ...dataToSend,
        }, {
            headers: {
                Authorization: `Bearer ${getCurrentToken()}`,
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    toast({
                        title: 'Successfully changed the password',
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
                //console.log(error);
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

    const onChangeEmailSubmit = (data: InputsChangeEmail) => {
        const dataToSend = {
            newEmail: data.newEmail,
            password: data.password,
        };
        // console.log(dataToSend);
        setShowConfirmationEmail(false);

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
                onSubmit={formEmail.handleSubmit(onChangeEmailSubmit)}
                className={`w-[32rem] ${formEmailState.isSubmitting ? "opacity-50" : ""}`}
            >
                <InputGroup>
                    <FormControl isRequired isInvalid={!!formEmailState.errors?.newEmail}>
                        <FormLabel marginBottom="20px" fontSize="30">Change e-mail address</FormLabel>
                        <InputLeftAddon backgroundColor="#FFE5CC" width="160px" height="45px" fontSize="15"
                                        marginBottom="20px" paddingLeft="10px" float="left">New e-mail
                            address</InputLeftAddon>
                        <Input marginBottom="20px" width="500px" height="45px" size='sm' float="left"
                               {...formEmail.register("newEmail", {
                                   required: true,
                                   validate: (value: string) =>
                                       isEmail(value) || "Invalid email address",
                               })}
                        ></Input>
                        {formEmailState.errors?.newEmail?.type != "validate" && (
                            <FormErrorMessage>Field required</FormErrorMessage>
                        )}
                        {formEmailState.errors?.newEmail?.type == "validate" && (
                            <FormErrorMessage>{formEmailState.errors?.newEmail?.message}</FormErrorMessage>
                        )}
                    </FormControl>

                </InputGroup>
                <InputGroup>
                    <InputLeftAddon backgroundColor="#FFE5CC" width="160px" height="45px" fontSize="15"
                                    marginBottom="20px" paddingLeft="10px">Password </InputLeftAddon>
                    <Input type="password" marginBottom="20px" width="500px" height="45px" size='sm'
                           {...formEmail.register("password", {
                               required: true,
                           })}
                    ></Input>
                </InputGroup>
                <Button marginBottom="160px" width="160px" height="40px"
                        onClick={() => setShowConfirmationEmail(true)}>Change</Button>
                {showConfirmationEmail && <> <Button type="submit">Confirm</Button> <Button
                    onClick={() => setShowConfirmationEmail(false)}>No</Button> </>}

            </form>
            <form
                noValidate
                onSubmit={formPassword.handleSubmit(onChangePasswordSubmit)}
                className={`w-[32rem] ${formPasswordState.isSubmitting ? "opacity-50" : ""}`}
            >
                <InputGroup>
                    <FormControl isRequired isInvalid={!!formPasswordState.errors?.oldPassword}>
                        <FormLabel marginBottom="20px" fontSize="30">Change password</FormLabel>
                        <InputLeftAddon backgroundColor="#FFE5CC" width="160px" height="45px" fontSize="15"
                                        marginBottom="20px" paddingLeft="10px" float="left">Old password</InputLeftAddon>
                        <Input type="password" marginBottom="20px" width="500px" height="45px" size='sm' float="left"
                               {...formPassword.register("oldPassword", {
                                   required: true,
                               })}
                        ></Input>
                        {formPasswordState.errors?.oldPassword?.type != "validate" && (
                            <FormErrorMessage>Field required</FormErrorMessage>
                        )}
                    </FormControl>
                </InputGroup>
                <InputGroup>
                    <FormControl isRequired isInvalid={!!formPasswordState.errors?.newPassword}>

                    <InputLeftAddon backgroundColor="#FFE5CC" width="160px" height="45px" fontSize="15"
                                    marginBottom="20px" paddingLeft="10px">New password</InputLeftAddon>
                    <Input type="password" marginBottom="20px" width="500px" height="45px" size='sm'
                           {...formPassword.register("newPassword", {
                               required: true,
                           validate: (value: string) =>
                               isStrongPassword(value) ||
                               "The password should be at least 8 characters long and contain at least one uppercase letter, a lowercase letter, a number and a special character.",
                           })}
                    ></Input>
                    {formPasswordState.errors?.newPassword?.type != "validate" && (
                        <FormErrorMessage>Field required</FormErrorMessage>
                    )}
                    {formPasswordState.errors?.newPassword?.type == "validate" && (
                        <FormErrorMessage>{formPasswordState.errors?.newPassword?.message}</FormErrorMessage>
                    )}
                    </FormControl>
                </InputGroup>
                <InputGroup>
                    <InputLeftAddon backgroundColor="#FFE5CC" width="160px" height="45px" fontSize="15"
                                    marginBottom="20px" paddingLeft="10px">Confirm new password </InputLeftAddon>
                    <Input type="password" marginBottom="20px" width="500px" height="45px" size='sm'
                           {...formPassword.register("repeatNewPassword", {
                               required: true,
                           })}
                    ></Input>
                </InputGroup>
                <Button marginBottom="160px" width="160px" height="40px"
                        onClick={() => setShowConfirmationPassword(true)}>Change</Button>
                {showConfirmationPassword && <> <Button type="submit">Confirm</Button> <Button
                    onClick={() => setShowConfirmationPassword(false)}>No</Button> </>}

            </form>
                <Flex direction="column" width="100%" alignItems="center" gap={5} mt="15vh">
                </Flex>
        </Layout>
    );
};

export default SettingsPage;