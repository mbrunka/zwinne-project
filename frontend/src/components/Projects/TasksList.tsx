import { useDebounce } from "@/hooks/useDebounce";
import { useToastPromise } from "@/hooks/useToast";
import { getCurrentRole } from "@/utils/cookies";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Edit, Trash, Trash2, X } from "react-feather";
import useSWR from "swr";
import CustomAlertDialog from "../common/AlertDialog";
import SelectAdvanced from "../common/SelectAdvanced";
import TableWithPagination from "../common/Table/TableWithPagination";
import TaskFormModal from "./TaskFormModal";

const PAGE_SIZE = 10;

const TasksList = ({ projectId }: { projectId?: number }) => {
  const toast = useToastPromise();
  const [selectedTask, setSelectedTask] = useState(undefined);
  const [selectedStudent, setSelectedStudent] = useState(undefined);
  const deleteTaskModal = useDisclosure();
  const taskFormModal = useDisclosure();
  const role = getCurrentRole();
  const [pageIndex, setPageIndex] = useState(0);
  const [filtersCount, setFiltersCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [taskTitle, setTaskTitle] = useState(null);
  const debouncedTaskTitle = useDebounce(taskTitle, 500);
  const [taskDescription, setTaskDescription] = useState(null);
  const [sort, setSort] = useState({ sortDirection: "", accessor: "" });
  const debouncedTaskDescription = useDebounce(taskDescription, 500);

  const {
    data: listData,
    isValidating,
    mutate: mutateList,
    error,
  } = useSWR(
    `/projekty/${projectId}/tasks?page=${pageIndex}&size=${PAGE_SIZE}${
      debouncedTaskDescription ? `&opis=${debouncedTaskDescription}` : ""
    }${
      sort?.accessor && sort?.sortDirection
        ? `&sort=${sort?.accessor},${sort?.sortDirection}`
        : ""
    }${
      selectedStudent != undefined ? `&studentId=${selectedStudent?.value}` : ""
    }${debouncedTaskTitle ? `&nazwa=${debouncedTaskTitle}` : ""}`
  );

  const { data: projectData, mutate: mutateProjectData } = useSWR(
    `/projekty/${projectId}`
  );

  const deleteTask = async () => {
    return toast.promise(
      axios
        .delete(`/projekty/task/${selectedTask?.zadanieId}`)
        .then(async () => {
          setPageIndex(0);
          await mutateList();
          await mutateProjectData();
          deleteTaskModal.onClose();
          setSelectedTask(null);
        })
        .catch(() => {
          deleteTaskModal.onClose();
          setSelectedTask(null);
        })
    );
  };

  const columnHeaderClick = (column: any) => {
    switch (column.sortDirection) {
      case "none":
        setSort({ sortDirection: "desc", accessor: column.id });
        break;
      case "asc":
        setSort({ sortDirection: "desc", accessor: column.id });
        break;
      case "desc":
        setSort({ sortDirection: "asc", accessor: column.id });
        break;
    }

    setPageIndex(0);
  };

  //TODO display students and status as coloured badge
  const columns = useMemo(() => {
    return [
      {
        id: "nazwa",
        Header: "Name",
        accessor: "nazwa",
        sortDirection: sort.accessor === "nazwa" ? sort.sortDirection : "none",
      },
      {
        id: "status",
        Header: "Status",
        accessor: "status.nazwa",
        sortDirection: sort.accessor === "status" ? sort.sortDirection : "none",
        Cell: ({ row }: { row: any }) => {
          return <Badge>{row?.original?.status?.nazwa}</Badge>;
        },
      },
      {
        id: "opis",
        Header: "Description",
        accessor: "opis",
        sortDirection: sort.accessor === "opis" ? sort.sortDirection : "none",
      },
      {
        DisableSortBy: true,
        Header: "Students",
        Cell: ({ row }: { row: any }) => {
          return row?.original?.studenci?.map((student: any) => (
            <div
              key={student?.studentId}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2px",
                marginBottom: "2px",
              }}
            >
              <Avatar
                name={`${student?.user?.firstName} ${student?.user?.lastName}`}
              />
              {student?.user?.firstName} {student?.user?.lastName}
            </div>
          ));
        },
      },
      {
        DisableSortBy: true,

        Header: "",
        id: "edition",
        Cell: ({ row }: { row: any }) => (
          <Flex gap={2} justifyContent="end">
            <Trash
              style={{ cursor: "pointer" }}
              onClick={() => {
                setSelectedTask(row?.original);
                deleteTaskModal?.onOpen();
              }}
            />
            <Edit
              style={{ cursor: "pointer" }}
              onClick={() => {
                setSelectedTask(row?.original);
                taskFormModal?.onOpen();
              }}
            />
          </Flex>
        ),
      },
    ];
  }, [deleteTaskModal, sort.accessor, sort.sortDirection, taskFormModal]);

  const studentOptions = useMemo(() => {
    return projectData?.students?.map((student) => {
      return {
        label: student?.user?.fullName,
        value: student?.studentId,
      };
    });
  }, [projectData?.students]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const countFilters = async () => {
    let count = 0;

    if (selectedStudent) count += 1;
    if (taskDescription) count += 1;
    if (taskTitle) count += 1;

    setFiltersCount(count);
  };

  useEffect(() => {
    countFilters();
  }, [countFilters, selectedStudent, taskDescription, taskTitle]);

  const clearFilters = () => {
    setSelectedStudent(undefined);
    setTaskTitle(undefined);
    setTaskDescription(undefined);
  };

  return (
    <Flex gap={2} marginLeft={3} direction="column">
      <CustomAlertDialog
        isOpen={deleteTaskModal.isOpen}
        onClose={deleteTaskModal.onClose}
        bodyText="Are you sure You want to delete this task?"
        headerText="Delete task"
        onConfirm={async () => {
          await deleteTask();
        }}
      />
      <TaskFormModal
        isOpen={taskFormModal.isOpen}
        onClose={taskFormModal.onClose}
        task={selectedTask}
        projectId={projectId}
      />
      <Button
        width="fit-content"
        onClick={() => {
          setSelectedTask(null);
          taskFormModal.onOpen();
        }}
      >
        Add task
      </Button>
      <Flex gap="5px" direction="column">
        <Flex alignItems="center">
          <Button
            width="fit-content"
            size="sm"
            mb={2}
            onClick={() => setShowFilters(!showFilters)}
          >
            {filtersCount > 0 ? `Filters (${filtersCount})` : "Filters"}
            <Icon as={showFilters ? ChevronUp : ChevronDown} size={20} ml={2} />
          </Button>

          {filtersCount > 0 && (
            <Tooltip hasArrow placement="top" label="Clear filters">
              <Icon
                cursor="pointer"
                ml="10px"
                w="20px"
                h="20px"
                as={Trash2}
                color="red.600"
                onClick={clearFilters}
              />
            </Tooltip>
          )}
        </Flex>

        {showFilters && (
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            mb={5}
            gap={{ base: "10px", md: 5 }}
          >
            <Box>
              <Text fontWeight="bold" mb="5px">
                Task title
              </Text>
              <InputGroup>
                <Input
                  placeholder="Search"
                  value={taskTitle}
                  onChange={(e) => {
                    setTaskTitle(e?.target?.value);
                    setPageIndex(0);
                  }}
                />
                {taskTitle && (
                  <InputRightElement p={2}>
                    <Icon
                      as={X}
                      w={4}
                      h={4}
                      color="GrayText"
                      _hover={{
                        color: "black",
                      }}
                      transition={"color 0.3s ease-in-out"}
                      onClick={() => setTaskTitle("")}
                    />
                  </InputRightElement>
                )}
              </InputGroup>
            </Box>

            <Box>
              <Text fontWeight="bold" mb="5px">
                Task description
              </Text>
              <InputGroup>
                <Input
                  placeholder="Search"
                  value={taskDescription}
                  onChange={(e) => {
                    setTaskDescription(e?.target?.value);
                    setPageIndex(0);
                  }}
                />
                {taskDescription && (
                  <InputRightElement p={2}>
                    <Icon
                      as={X}
                      w={4}
                      h={4}
                      color="GrayText"
                      _hover={{
                        color: "black",
                      }}
                      transition={"color 0.3s ease-in-out"}
                      onClick={() => setTaskDescription("")}
                    />
                  </InputRightElement>
                )}
              </InputGroup>
            </Box>
            <Box>
              <Text fontWeight="bold" mb="5px">
                Assigned student
              </Text>
              <SelectAdvanced
                placeholder="Choose student"
                options={studentOptions}
                onChange={(value) => {
                  setSelectedStudent(value);
                  setPageIndex(0);
                }}
                value={selectedStudent}
                isClearable
              />
            </Box>
          </Grid>
        )}
      </Flex>
      {isValidating && !listData && <Spinner color="red.700" />}
      {listData?.totalElements == 0 && <Text mt="10px">No tasks</Text>}
      {listData?.totalElements > 0 && (
        <TableWithPagination
          data={listData?.content || []}
          columns={columns}
          columnHeaderClick={columnHeaderClick}
          count={listData?.totalElements}
          error={error}
          pageIndex={pageIndex}
          pagesNum={listData?.totalPages}
          setPageIndex={setPageIndex}
        />
      )}
    </Flex>
  );
};

export default TasksList;
