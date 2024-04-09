import { useRef } from "react";
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from "@chakra-ui/react";

const CustomAlertDialog = ({
  isOpen,
  onClose,
  bodyText,
  headerText,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  bodyText: string;
  headerText: string;
  onConfirm: () => void;
}) => {
  const cancelRef = useRef(null);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>
            {headerText}
          </AlertDialogHeader>
          <AlertDialogBody>{bodyText}</AlertDialogBody>
          <AlertDialogFooter justifyContent="center">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onConfirm} ml={3}>
              Confirm
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default CustomAlertDialog;
