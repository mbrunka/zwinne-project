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
    FormControl, FormLabel,
} from '@chakra-ui/react';
import Layout from '../components/Layout';
import React, {useState} from "react";
import axios from "axios";
import { isEmail, isStrongPassword } from "validator";
import {useForm} from "react-hook-form";
import {getCurrentToken} from "@/utils/cookies";
import {ButtonGroup} from "chakra-ui";

type Inputs = {
    email: string;
    password: string;
    old_password: string;
    new_password: string;
    repeat_new_password: string;
}

const SettingsPage = () => {

    //const { isOpen: isOpen1Modal, onOpen: onOpen1Modal, onClose: onClose1Modal } = useDisclosure();
    const { isOpen: isOpen2Modal, onOpen: onOpen2Modal, onClose: onClose2Modal } = useDisclosure();

    const [showConfirmation, setShowConfirmation] = useState(false);

    const {
        control,
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
     } = useForm<Inputs>();

    const onChangeEmailSubmit = (data: Inputs) => {

        // if (data.new_password != data.repeat_new_password) {
        //     //setError("Different Passwords!");
        //     return;
        // }

        const dataToSend = {
            email: data.email,
            password: data.password,
        };
        console.log(dataToSend);
        setShowConfirmation(false);

        axios.post("user/changeEmail", {
            ...dataToSend,
        }, { headers: {
            Authorization: getCurrentToken(), //dostaje 403
        }})
        .then((data) => {
           // setError(null);
            console.log(data);
        })
        .catch((error) => {
            console.log(error);
        });

        // const dataToSendPasswordChange = {
        //     old_password: data.old_password,
        //     new_password: data.new_password,
        // };

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

            <Text marginBottom="20px" fontSize="30">Change password</Text>
            <InputGroup>
                <InputLeftAddon backgroundColor="#FFE5CC" width="160px" fontSize="15" marginBottom="20px" paddingLeft="10px">Old password </InputLeftAddon>
                <Input name="settings_old_password" placeholder='' marginBottom="20px" width="500px" size='sm'

                ></Input>
            </InputGroup>
            <InputGroup>
                <InputLeftAddon backgroundColor="#FFE5CC" width="160px" fontSize="15" marginBottom="20px" paddingLeft="10px">New password </InputLeftAddon>
                <Input name="settings_new_password" placeholder='' marginBottom="20px" width="500px" size='sm'></Input>
            </InputGroup>
            <InputGroup>
                <InputLeftAddon backgroundColor="#FFE5CC" width="160px" fontSize="15" marginBottom="20px" paddingLeft="10px">Repeat new password </InputLeftAddon>
                <Input name="settings_new_password_check" placeholder='' marginBottom="20px" width="500px" size='sm'></Input>
            </InputGroup>
            <Button marginBottom="10px" width="160px" onClick={() => onOpen2Modal()}>Change</Button>

            <>
                <Modal  isOpen={isOpen2Modal} onClose={onClose2Modal}>
                    <ModalOverlay/>
                    <ModalContent>
                        <ModalHeader>Warning!</ModalHeader>
                        <ModalBody>Do you really want to change password?</ModalBody>
                        <ModalFooter>
                            <Button mr={3} onClick={onClose2Modal}>Tak</Button>
                            <Button mr={3} onClick={onClose2Modal}>Nie</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>

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