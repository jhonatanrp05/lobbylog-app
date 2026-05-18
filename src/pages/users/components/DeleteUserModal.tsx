import type { User } from "@/lib/types";

import { Button, Modal } from "@heroui/react";

type DeleteUserModalProps = {
  state: { isOpen: boolean; open: () => void; close: () => void };
  user: User | null;
  onConfirm: () => void;
};

export function DeleteUserModal({
  state,
  user,
  onConfirm,
}: DeleteUserModalProps) {
  const modalState = {
    ...state,
    setOpen: (isOpen: boolean) => {
      if (isOpen) state.open();
      else state.close();
    },
    toggle: () => {
      if (state.isOpen) state.close();
      else state.open();
    },
  };

  return (
    <Modal state={modalState}>
      <Modal.Backdrop>
        <Modal.Container size="sm">
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>Delete user</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <p className="text-foreground">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{user?.name}</span>? This action
                cannot be undone.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline" onPress={state.close}>
                Cancel
              </Button>
              <Button variant="danger" onPress={onConfirm}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
