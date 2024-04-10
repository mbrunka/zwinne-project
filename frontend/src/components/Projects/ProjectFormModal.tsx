import { useToastPromise } from "@/hooks/useToast";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { mutate } from "swr";

type Props = {
  isOpen: boolean;
  project?: any;
  onClose: () => void;
};

type Inputs = {
  nazwa: string;
  opis: string;
};

const ProjectFormModal = ({
  project,
  isOpen,
  onClose,
}: Props): React.ReactElement => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();
  const toast = useToastPromise();

  useEffect(() => {
    if (!!project) reset({ nazwa: project?.nazwa, opis: project?.opis });
    if (!project) reset({ nazwa: "", opis: "" });
  }, [project, reset]);

  const onSubmit = async (data: Inputs) => {
    return toast.promise(
      !project
        ? axios.post(`/projekty/teacher/create`, data).then(async () => {
            await mutate("/projekty/my");
            reset({ nazwa: "", opis: "" });
            onClose();
          })
        : axios
            .patch(`/projekty/teacher/${project?.projektId}`, data)
            .then(async () => {
              await mutate("/projekty/my");
              onClose();
            })
    );
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        motionPreset="slideInBottom"
        preserveScrollBarGap
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <ModalContent>
            <ModalHeader>
              {!project ? "New project" : "Edit project"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl isRequired isInvalid={!!errors?.nazwa}>
                <FormLabel>Project name</FormLabel>
                <Input
                  autoFocus
                  {...register("nazwa", {
                    required: true,
                  })}
                />
                {!!errors?.nazwa && (
                  <FormErrorMessage>Field required</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired isInvalid={!!errors?.opis} mt={5}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  {...register("opis", {
                    required: true,
                    maxLength: 499,
                  })}
                />
                {!!errors?.opis && (
                  <FormErrorMessage>Field required</FormErrorMessage>
                )}
              </FormControl>
            </ModalBody>
            <ModalFooter gap="10px">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                isLoading={isSubmitting}
                isDisabled={isSubmitting}
                type="submit"
              >
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default ProjectFormModal;
