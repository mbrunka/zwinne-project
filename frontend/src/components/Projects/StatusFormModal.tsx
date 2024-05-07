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
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { mutate } from "swr";
import ColorPicker from "../common/ColorPicker";

type Props = {
  isOpen: boolean;
  projectId?: any;
  status?: any;
  biggestWaga?: number;
  onClose: () => void;
};

type Inputs = {
  nazwa: string;
  kolor: string;
};

const StatusFormModal = ({
  projectId,
  status,
  biggestWaga,
  isOpen,
  onClose,
}: Props): React.ReactElement => {
  const {
    reset,
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();
  const toast = useToastPromise();

  useEffect(() => {
    if (!!status)
      reset({
        nazwa: status?.title,
        kolor: status?.kolor,
      });
    if (!status) reset({ nazwa: "", kolor: "#46808c" });
  }, [status, reset]);

  const onSubmit = async (data: Inputs) => {
    const dataToSend = {
      ...data,
      projektId: projectId,
      waga: biggestWaga ? biggestWaga + 50 : 1000,
    };
    return toast.promise(
      !status
        ? axios.post(`/projekty/teacher/status`, dataToSend).then(async () => {
            await mutate(`/projekty/${projectId}/kanban`);
            reset({ nazwa: ``, kolor: `` });
            onClose();
          })
        : axios
            .patch(`/projekty/teacher/status`, {...dataToSend, statusId: status?.id, waga: status?.waga})
            .then(async () => {
              await mutate(`/projekty/${projectId}/kanban`);
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
      >
        <ModalOverlay />
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <ModalContent>
            <ModalHeader>{!status ? "New status" : "Edit status"}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl isRequired isInvalid={!!errors?.nazwa}>
                <FormLabel>Name</FormLabel>
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
              <FormControl isInvalid={!!errors.kolor}>
                <FormLabel>Color</FormLabel>
                <Controller
                  name="kolor"
                  control={control}
                  rules={{ required: true }}
                  render={() => (
                    <ColorPicker
                      control={control}
                      name="kolor"
                      header="Color"
                    />
                  )}
                />
                {!!errors?.kolor && (
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

export default StatusFormModal;
