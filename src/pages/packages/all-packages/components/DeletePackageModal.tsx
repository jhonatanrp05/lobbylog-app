import type { AdminPackage } from "@/lib/types";

import { Button, Modal } from "@heroui/react";

type DeletePackageModalProps = {
  state: { isOpen: boolean; open: () => void; close: () => void };
  pkg: AdminPackage | null;
  onConfirm: () => void;
};

export function DeletePackageModal({
  state,
  pkg,
  onConfirm,
}: DeletePackageModalProps) {
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
              <Modal.Heading>Delete package</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <p className="text-foreground">
                Are you sure you want to delete the package{" "}
                <span className="font-semibold">{pkg?.description}</span>? This
                action cannot be undone.
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
