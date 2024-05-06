import { useToastPromise } from "@/hooks/useToast";
import { getCurrentRole } from "@/utils/cookies";
import Board from "@asseinfo/react-kanban";
import "@asseinfo/react-kanban/dist/styles.css";
import { Avatar, Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Edit, Trash } from "react-feather";
import useSWR from "swr";
import CustomAlertDialog from "../common/AlertDialog";
import StatusFormModal from "./StatusFormModal";
import TaskFormModal from "./TaskFormModal";

const Kanban = ({ projectId }: { projectId?: number }) => {
  const {
    data: kanbanData,
    isValidating,
    mutate: mutateKanban,
  } = useSWR(`/projekty/${projectId}/kanban`);
  const toast = useToastPromise();
  const [controlledBoard, setBoard] = useState();
  const [selectedTask, setSelectedTask] = useState();
  const [selectedStatus, setSelectedStatus] = useState();
  const deleteTaskModal = useDisclosure();
  const taskFormModal = useDisclosure();
  const statusFormModal = useDisclosure();
  const deleteStatusModal = useDisclosure();
  const role = getCurrentRole();

  const deleteTask = async () => {
    return toast.promise(
      axios
        .delete(`/projekty/task/${selectedTask?.zadanieId}`)
        .then(async () => {
          await mutateKanban();
          deleteTaskModal.onClose();
          setSelectedTask(null);
        })
        .catch(() => {
          deleteTaskModal.onClose();
          setSelectedTask(null);
        })
    );
  };

  const deleteStatus = async () => {
    return toast.promise(
      axios
        .delete(`/projekty/teacher/status/${selectedStatus?.id}`)
        .then(async () => {
          await mutateKanban();
          deleteStatusModal.onClose();
          setSelectedStatus(null);
        })
        .catch(() => {
          deleteStatusModal.onClose();
          setSelectedStatus(null);
        })
    );
  };

  useEffect(() => {
    setBoard({
      columns: kanbanData
        ?.sort((a, b) => a?.waga - b?.waga)
        ?.map((column) => ({
          id: column.statusId,
          title: column.nazwa,
          kolor: column.kolor,
          waga: column?.waga,
          cards: column?.zadania?.map((zadanie) => ({
            id: zadanie.zadanieId,
            title: zadanie.nazwa,
            description: (
              <div style={{display:"flex", flexDirection:"column"}}>
                <label className="description-text">
                  Opis: {zadanie?.opis}
                </label>{" "}
                {/* <label className="description-text">
                  Priorytet: {zadanie?.waga}
                </label>{" "} */}
                
                  {zadanie?.studenci?.map((student)=><div key={student?.studentId} style={{display:"flex", alignItems:"center", gap:'5px'}}><Avatar name={`${student?.user?.firstName} ${student?.user?.lastName}`}/>{student?.user?.firstName} {student?.user?.lastName}</div>)}
                
                <Flex gap={2} justifyContent="end">
                  <Trash
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setSelectedTask(zadanie);
                      deleteTaskModal?.onOpen();
                    }}
                  />
                  <Edit
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setSelectedTask(zadanie);
                      taskFormModal?.onOpen();
                    }}
                  />
                </Flex>
              </div>
            ),
          })),
        })),
    });
  }, [deleteTaskModal, kanbanData, taskFormModal]);

  function handleCardMove(_card, source, destination) {
    return toast.promise(
      axios
        .patch(`/projekty/task/status`, {
          zadanieId: _card?.id,
          statusId: destination?.toColumnId,
        })
        .finally(() => {
          mutateKanban();
        })
    );
  }

  function handleColumnMove(board, column, source, destination) {
    const sortedData = kanbanData?.sort((a, b) => a?.waga - b?.waga);
    const newWaga =
      source?.toPosition > 0 ?
      source?.toPosition == sortedData?.length-1 ? +sortedData?.[source?.toPosition]?.waga + 50:
         sortedData?.[source?.toPosition]?.waga -
          (+sortedData?.[source?.toPosition]?.waga -
            +sortedData?.[source?.toPosition - 1]?.waga) /
            2
        : +sortedData?.[source?.toPosition]?.waga / 2;
    const dataToSend = {
      projektId: projectId,
      statusId: board?.id,
      waga: newWaga,
      nazwa: board?.title,
      kolor: board?.kolor,
    };
    return toast.promise(
      axios.patch(`/projekty/teacher/status`, dataToSend).then(async () => {
        await mutateKanban();
      })
    );
  }

  return (
    <>
      <Flex gap={2} marginLeft={3}>
        {role == "NAUCZYCIEL" && (
          <Button
            onClick={() => {
              setSelectedStatus(null);
              statusFormModal.onOpen();
            }}
          >
            Dodaj kolumnę
          </Button>
        )}
        <Button
          onClick={() => {
            setSelectedTask(null);
            taskFormModal.onOpen();
          }}
        >
          Dodaj zadanie
        </Button>
      </Flex>
      {controlledBoard?.columns?.length > 0 && (
        <Board
          onCardDragEnd={handleCardMove}
          onColumnDragEnd={handleColumnMove}
          renderColumnHeader={(card) => (
            <Flex justifyContent="space-between">
              <Text color={card?.kolor} fontSize="18" fontWeight={800}>
                {card?.title}
              </Text>
              {role == "NAUCZYCIEL" && <Flex gap={3}>
                <Trash
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelectedStatus(card);
                    deleteStatusModal?.onOpen();
                  }}
                />
                <Edit
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelectedStatus(card);
                    statusFormModal?.onOpen();
                  }}
                />
              </Flex>}
            </Flex>
          )}
        >
          {controlledBoard}
        </Board>
      )}
      <CustomAlertDialog
        isOpen={deleteTaskModal.isOpen}
        onClose={deleteTaskModal.onClose}
        bodyText="Are you sure You want to delete this task?"
        headerText="Delete task"
        onConfirm={async () => {
          await deleteTask();
        }}
      />
      <CustomAlertDialog
        isOpen={deleteStatusModal.isOpen}
        onClose={deleteStatusModal.onClose}
        bodyText="Are you sure You want to delete this status? This will cause a loss of any tasks with this status!"
        headerText="Delete Status"
        onConfirm={async () => {
          await deleteStatus();
        }}
      />
      <TaskFormModal
        isOpen={taskFormModal.isOpen}
        onClose={taskFormModal.onClose}
        task={selectedTask}
        projectId={projectId}
      />
      <StatusFormModal
        isOpen={statusFormModal.isOpen}
        onClose={statusFormModal.onClose}
        status={selectedStatus}
        projectId={projectId}
        biggestWaga={kanbanData?.sort((a, b) => b?.waga - a?.waga)?.[0]?.waga}
      />
    </>
  );
};

export default Kanban;
