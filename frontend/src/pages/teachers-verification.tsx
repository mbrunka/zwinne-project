import CustomAlertDialog from "@/components/common/AlertDialog";
import Table from "@/components/common/Table";
import { useToastPromise } from "@/hooks/useToast";
import {
  Button,
  Flex,
  Heading,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";
import Layout from "../components/Layout";

const TeachersVerificationPage = () => {
  const { data, mutate, isValidating } = useSWR("/auth/getCandidates");
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
        .then(() => {
          mutate();
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
      { Header: "Email", accessor: "email" },
      { Header: "Name", accessor: "fullName" },
      {
        id: "edit",
        accessor: ({ email }: { email: string }) => (
          <Flex
            width="100%"
            justifyContent="flex-end"
            fontSize="18px"
            lineHeight={1}
            gap={4}
          >
            <Button
              size="sm"
              isLoading={isGenerating == email}
              onClick={async () => {
                await openAlertModal(email);
              }}
            >
              Verify
            </Button>
          </Flex>
        ),
      },
    ],
    [isGenerating, openAlertModal]
  );

  return (
    <Layout>
      <Heading marginBottom="30px">Teachers to verify</Heading>
      {isValidating && !data?.users && <Spinner />}
      {data?.users?.length == 0 && <Text>No candidates to verify</Text>}
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
        bodyText="Are you sure You want to verify this candidate?"
        headerText="Candidate verification"
        onConfirm={async () => {
          await verifyCandidate(selectedEmail ?? "");
        }}
      />
    </Layout>
  );
};

TeachersVerificationPage.auth = true;
TeachersVerificationPage.roles = ["NAUCZYCIEL"];

export default TeachersVerificationPage;
