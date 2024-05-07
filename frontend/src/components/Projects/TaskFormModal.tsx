import { useToastPromise } from "@/hooks/useToast";
import { getCurrentRole } from "@/utils/cookies";
import {
  Button,
  Flex,
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
import { Select } from "chakra-react-select";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useSWR, { mutate } from "swr";
import Cookies from "js-cookie";

type Props = {
  isOpen: boolean;
  projectId?: any;
  task?: any;
  onClose: () => void;
};

type Inputs = {
  nazwa: string;
  opis: string;
  piorytet: number;
  statusId: number;
};

const TaskFormModal = ({
  projectId,
  task,
  isOpen,
  onClose,
}: Props): React.ReactElement => {
  const { data: statusesData, isValidating: isStatusesDataValidating } = useSWR(
    `/projekty/${projectId}/kanban`
  );
  const { data: taskData, isValidating: isTaskDataValidating } = useSWR(
    `/projekty/task/${task?.zadanieId}`
  );
  const {
    reset,
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();
  const toast = useToastPromise();
  const [processing, setProcessing] = useState<boolean>(false);

  const statusOptions = useMemo(
    () =>
      statusesData?.map((item) => ({
        value: item?.statusId,
        label: item?.nazwa,
      })),
    [statusesData]
  );

  const isStudentAssigned = useMemo(()=>{
    return task?.studenci?.find(student=>student?.user?.email==Cookies.get("email"))
  },[task])

  useEffect(() => {
    if (!!task)
      reset({
        nazwa: task?.nazwa,
        opis: task?.opis,
        piorytet: task?.piorytet,
        statusId: statusOptions?.find(
          (status) => status?.statusId == task?.statusId
        ),
      });
    if (!task) reset({ nazwa: "", opis: "" });
  }, [task, reset, statusOptions]);

  const onSubmit = async (data: Inputs) => {
    const dataToSend = {
      ...data,
      projektId: projectId,
      statusId: data?.statusId?.value,
    };
    return toast.promise(
      !task
        ? axios.post(`/projekty/task`, dataToSend).then(async () => {
            await mutate(`/projekty/${projectId}/kanban`);
            reset({ nazwa: ``, opis: `` });
            onClose();
          })
        : axios
            .patch(`/projekty/task/${task?.zadanieId}`, dataToSend)
            .then(async () => {
              await mutate(`/projekty/${projectId}/kanban`);
              onClose();
            })
    );
  };

  const selfAssign = async () => {
    setProcessing(true);
    return toast.promise(
      axios
        .post(`/projekty/task/${task?.zadanieId}/join`)
        .then(async () => {
          await mutate(`/projekty/${projectId}/kanban`);
          reset({ nazwa: ``, opis: `` });
          setProcessing(false);
          onClose();
        })
        .catch(() => {
          setProcessing(false);
        })
    );
  };

  const selfUnassign = async () => {
    setProcessing(true);
    return toast.promise(
      axios
        .post(`/projekty/task/${task?.zadanieId}/leave`)
        .then(async () => {
          await mutate(`/projekty/${projectId}/kanban`);
          reset({ nazwa: ``, opis: `` });
          setProcessing(false);
          onClose();
        })
        .catch(() => {
          setProcessing(false);
        })
    );
  };

  const role = getCurrentRole();

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
            <ModalHeader>
              <Flex marginRight={5} justifyContent="space-between">
                {!task ? "New task" : "Edit task"}
                {role == "STUDENT" && !!task && (
                  <Button
                    isLoading={processing}
                    isDisabled={processing}
                    onClick={!!isStudentAssigned ? selfUnassign : selfAssign}
                  >
                    {!!isStudentAssigned ? "Unassign yourself" : "Assign yourself"}
                  </Button>
                )}
              </Flex>
            </ModalHeader>
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
              <FormControl isRequired isInvalid={!!errors?.piorytet} mt={5}>
                <FormLabel>Priority</FormLabel>
                <Input
                  defaultValue={0}
                  type="number"
                  {...register("piorytet", {
                    required: true,
                    maxLength: 1,
                  })}
                />
                {!!errors?.piorytet && (
                  <FormErrorMessage>Field required</FormErrorMessage>
                )}
              </FormControl>

              <FormControl isRequired isInvalid={!!errors?.statusId} mt={5}>
                <FormLabel>Status</FormLabel>
                <Controller
                  name="statusId"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      options={statusOptions}
                      placeholder="Status"
                      {...field}
                      //   menuPortalTarget={document.body}
                    />
                  )}
                />
                {!!errors?.statusId && (
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

export default TaskFormModal;
