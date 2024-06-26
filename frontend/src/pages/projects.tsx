import CustomAlertDialog from "@/components/common/AlertDialog";
import Table from "@/components/common/Table";
import JoinProjectFrom from "@/components/Projects/JoinProjectForm";
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
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";
import Layout from "../components/Layout";

const ProjectsPage = () => {
  const { data, mutate, isValidating } = useSWR("/projekty/my");
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [selectedProject, setSelectedProject] = useState<any | undefined>();
  const toast = useToastPromise();
  const modal = useDisclosure();
  const leaveModal = useDisclosure();
  const projectModal = useDisclosure();
  const role = getCurrentRole();
  const router = useRouter();

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

  const leaveProject = async (id: number) => {
    return toast.promise(
      axios
        .post(`/projekty/leave`, { projektId: id })
        .then(async () => {
          await mutate();
          leaveModal.onClose();
        })
        .catch(() => {
          leaveModal.onClose();
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

  const openLeaveAlertModal = useCallback(
    (id: number) => {
      setSelectedId(id);
      leaveModal.onOpen();
    },
    [leaveModal]
  );

  const columns = useMemo(() => {
    if (role == "NAUCZYCIEL") {
      return [
        { Header: "ID", accessor: "projektId" },
        { Header: "Name", accessor: "nazwa" },
        { Header: "Description", accessor: "opis" },
        {
          Header: "Join code",
          accessor: "joinCode",
        },
        {
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
                <Button
                  size="sm"
                  variant="outlined"
                  color="#813531"
                  onClick={() => {
                    router?.push(`/projekt/${row?.original?.projektId}`);
                  }}
                >
                  Details
                </Button>
              </Flex>
            );
          },
        },
      ];
    } else {
      return [
        { Header: "Name", accessor: "nazwa" },
        { Header: "Description", accessor: "opis" },
        { Header: "Teacher", accessor: "teacher.user.fullName" },
        {
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
                    await openLeaveAlertModal(row?.original?.projektId);
                  }}
                >
                  Leave
                </Button>
                <Button
                  size="sm"
                  variant="outlined"
                  color="#813531"
                  onClick={() => {
                    router?.push(`/projekt/${row?.original?.projektId}`);
                  }}
                >
                  Details
                </Button>
              </Flex>
            );
          },
        },
      ];
    }
  }, [openAlertModal, openLeaveAlertModal, projectModal, role, router]);

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
      {role == "STUDENT" && <JoinProjectFrom />}
      {isValidating && !data && <Spinner />}
      {data?.length == 0 && <Text>No projects</Text>}
      {data?.length > 0 && role && (
        <Table
          columns={columns}
          data={data || data?.[0]}
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
      <CustomAlertDialog
        isOpen={leaveModal.isOpen}
        onClose={leaveModal.onClose}
        bodyText="Are you sure You want to leave this project?"
        headerText="Leave project"
        onConfirm={async () => {
          await leaveProject(selectedId ?? 0);
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
