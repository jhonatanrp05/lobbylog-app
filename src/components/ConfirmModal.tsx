import { Button, Modal } from "@heroui/react";

type ConfirmModalProps = {
  state: { isOpen: boolean; open: () => void; close: () => void };
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  onConfirm: () => void;
};

export function ConfirmModal({
  state,
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
}: ConfirmModalProps) {
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
              <Modal.Heading>{title}</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <div className="text-foreground">{message}</div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline" onPress={state.close}>
                Cancel
              </Button>
              <Button variant="danger" onPress={onConfirm}>
                {confirmLabel}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
