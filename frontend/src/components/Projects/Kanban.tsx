import { useToastPromise } from "@/hooks/useToast";
import Board from "@asseinfo/react-kanban";
import "@asseinfo/react-kanban/dist/styles.css";
import { Button, Flex, useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Edit, Trash } from "react-feather";
import useSWR from "swr";
import CustomAlertDialog from "../common/AlertDialog";
import TaskFormModal from "./TaskFormModal";

const board = {
  columns: [
    {
      id: 1,
      title: "Backlog",
      cards: [
        {
          id: 1,
          title: "Add card",
          description: "Add capability to add a card in a column",
        },
      ],
    },
    {
      id: 2,
      title: "Doing",
      cards: [
        {
          id: 2,
          title: "Drag-n-drop support",
          description: "Move a card between the columns",
        },
      ],
    },
  ],
};

const Kanban = ({ projectId }: { projectId?: number }) => {
  const {
    data: kanbanData,
    isValidating,
    mutate: mutateKanban,
  } = useSWR(`/projekty/${projectId}/kanban`);
  const toast = useToastPromise();
  const [controlledBoard, setBoard] = useState();
  const [selectedTask, setSelectedTask] = useState();
  const deleteTaskModal = useDisclosure();
  const taskFormModal = useDisclosure();

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

  useEffect(() => {
    setBoard({
      columns: kanbanData
        ?.sort((a, b) => a?.waga - b?.waga)
        ?.map((column) => ({
          id: column.statusId,
          title: column.nazwa,
          backgroundColor: column.kolor,
          cards: column?.zadania?.map((zadanie) => ({
            id: zadanie.zadanieId,
            title: zadanie.nazwa,
            description: (
              <div>
                <label className="description-text">
                  Opis: {zadanie?.opis}
                </label>{" "}
                <br />
                <label className="description-text">
                  Priorytet: {zadanie?.piorytet}
                </label>{" "}
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
  return (
    <>
      <Flex gap={2}>
        <Button>Dodaj kolumnę</Button>
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
        <Board onCardDragEnd={handleCardMove}>{controlledBoard}</Board>
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
      <TaskFormModal
        isOpen={taskFormModal.isOpen}
        onClose={taskFormModal.onClose}
        task={selectedTask}
        projectId={projectId}
      />
    </>
  );
};

export default Kanban;
