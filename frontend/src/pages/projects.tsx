import CustomAlertDialog from "@/components/common/AlertDialog";
import Table from "@/components/common/Table";
import ProjectFormModal from "@/components/Projects/ProjectFormModal";
import { useToastPromise } from "@/hooks/useToast";
import { getCurrentRole } from "@/utils/cookies";
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

const ProjectsPage = () => {
  const { data, mutate, isValidating } = useSWR("/projekty/my");
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [selectedProject, setSelectedProject] = useState<any | undefined>();
  const toast = useToastPromise();
  const modal = useDisclosure();
  const projectModal = useDisclosure();
  const role = getCurrentRole();

  const deleteProject = async (id: number) => {
    return toast.promise(
      axios
        .delete(`/projekty/teacher/${id}`)
        .then(async () => {
          await mutate();
          modal.onClose();
        })
        .catch(() => {
          modal.onClose();
        })
    );
  };

  const openAlertModal = useCallback(
    (id: number) => {
      setSelectedId(id);
      modal.onOpen();
    },
    [modal]
  );

  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "projektId" },
      { Header: "Name", accessor: "nazwa" },
      { Header: "Description", accessor: "opis" },
      role == "NAUCZYCIEL" && {
        Header: "Join code",
        accessor: "joinCode",
      },
      role == "NAUCZYCIEL" && {
        Header: "Edition",
        Cell: ({ row }: { row: any }) => {
          return (
            <Flex
              width="100%"
              direction="column"
              fontSize="18px"
              lineHeight={1}
              gap={4}
            >
              <Button
                size="sm"
                onClick={async () => {
                  await openAlertModal(row?.original?.projektId);
                }}
              >
                Delete
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setSelectedProject(row?.original);
                  projectModal.onOpen();
                }}
              >
                Edit
              </Button>
            </Flex>
          );
        },
      },
    ],
    [openAlertModal, projectModal, role]
  );

  return (
    <Layout>
      <Heading marginBottom="30px">Projects</Heading>
      {role == "NAUCZYCIEL" && (
        <Button
          marginBottom="10px"
          onClick={() => {
            setSelectedProject(undefined);
            projectModal.onOpen();
          }}
        >
          Add
        </Button>
      )}
      {role == "STUDENT" && <></>}
      {isValidating && !data && <Spinner />}
      {data?.length == 0 && <Text>No projects</Text>}
      {data?.length > 0 && (
        <Table
          columns={columns}
          data={data}
          searchBar={false}
          pagination={false}
        />
      )}
      <CustomAlertDialog
        isOpen={modal.isOpen}
        onClose={modal.onClose}
        bodyText="Are you sure You want to delete this project?"
        headerText="Delete project"
        onConfirm={async () => {
          await deleteProject(selectedId ?? 0);
        }}
      />
      <ProjectFormModal
        isOpen={projectModal.isOpen}
        onClose={projectModal.onClose}
        project={selectedProject}
      />
    </Layout>
  );
};

ProjectsPage.auth = true;
ProjectsPage.roles = ["NAUCZYCIEL", "STUDENT"];

export default ProjectsPage;
