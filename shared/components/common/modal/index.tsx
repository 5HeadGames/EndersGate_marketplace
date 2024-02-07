"use client";
import * as React from "react";
import Box, { BoxProps } from "@mui/material/Box";
import Modal from "@mui/material/Modal";
//import {XIcon} from "@heroicons/react/solid";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

interface ModalProps {
  content: any;
  showModal: boolean;
  setShowModal: any;
  showBtn?: boolean;
  showBtnText?: string;
  boxProps?: BoxProps;
}

const ModalComp = ({
  content,
  showModal,
  setShowModal,
  showBtn = true,
  showBtnText = "Toggle modal",
  boxProps,
}: ModalProps) => {
  const [open, setOpen] = React.useState(showModal);
  const handleOpen = () => setOpen(true);
  const handleClose = (e: Event, reason: string) => {
    if (["escapeKeyDown", "backdropClick"].indexOf(reason) === -1) {
      setOpen(false);
    }
  };

  const onModalClose = (e: any) => {
    setOpen(false);
    setShowModal(false);
  };

  React.useEffect(() => {
    setOpen(showModal);
  }, [showModal]);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          className="flex flex-col gap-4 items-center"
          {...boxProps}
        >
          <div className="flex flex-row justify-end w-full">
            <button onClick={onModalClose}>
              {
                //<XIcon width={25} className="m-0" />
              }
            </button>
          </div>
          {content}
        </Box>
      </Modal>
    </>
  );
};

export default ModalComp;
