import CustomAlertDialog from "@/components/common/AlertDialog";
import Table from "@/components/common/Table";
import { useToastPromise } from "@/hooks/useToast";
import { Button, Flex, Spinner, Text, useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import { useCallback, useMemo, useState } from "react";
import { Check, X } from "react-feather";
import useSWR, { mutate } from "swr";

const Students = () => {
  const {
    data,
    mutate: mutateStudents,
    isValidating,
  } = useSWR("/auth/getStudents");
  const toast = useToastPromise();
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const modal = useDisclosure();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const verifyCandidate = async (email: string) => {
    setIsGenerating(email);
    return toast.promise(
      axios
        .put(`/auth/verifyCandidate`, { email: email })
        .then(async () => {
          await mutateStudents();
          await mutate("/auth/getTeachers");
          setIsGenerating(null);
          modal.onClose();
        })
        .catch(() => {
          setIsGenerating(null);
          modal.onClose();
        })
    );
  };

  const openAlertModal = useCallback(
    (email: string) => {
      setSelectedEmail(email);
      modal.onOpen();
    },
    [modal]
  );

  const columns = useMemo(
    () => [
      { Header: "Email", accessor: "user.email" },
      { Header: "Name", accessor: "user.fullName" },
      { Header: "Index no", accessor: "student.nrIndeksu" },
      {
        id: "stationary",
        Header: "Stationary",
        accessor: ({ student }: { student: any }) => (
          <>
            {student?.stacjonarny ? (
              <Check color="green" />
            ) : (
              <X color="gray" />
            )}
          </>
        ),
      },
      {
        id: "edit",
        accessor: ({ user }: { user: any }) => (
          <Flex
            width="100%"
            justifyContent="flex-end"
            fontSize="18px"
            lineHeight={1}
            gap={4}
          >
            <Button
              size="sm"
              isLoading={isGenerating == user?.email}
              onClick={async () => {
                await openAlertModal(user?.email);
              }}
            >
              Verify as teacher
            </Button>
          </Flex>
        ),
      },
    ],
    [isGenerating, openAlertModal]
  );

  return (
    <>
      {isValidating && !data?.users && <Spinner />}
      {data?.users?.length == 0 && <Text>No students</Text>}
      {data?.users?.length > 0 && (
        <Table
          columns={columns}
          data={data?.users}
          searchBar={false}
          pagination={false}
        />
      )}
      <CustomAlertDialog
        isOpen={modal.isOpen}
        onClose={modal.onClose}
        bodyText="Are you sure You want to verify this user as a teacher?"
        headerText="Teacher verification"
        onConfirm={async () => {
          await verifyCandidate(selectedEmail ?? "");
        }}
      />
    </>
  );
};

export default Students;
