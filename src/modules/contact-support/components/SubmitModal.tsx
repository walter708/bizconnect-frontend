"use client";
import Modal from "react-modal";
import { FlexRowCenter } from "@components/Flex";

interface IContactSupportSubmitModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  successMessage: string;
  errorMessage: string;
}

export default function ContactSupportSubmitModal({
  isModalOpen,
  closeModal,
  successMessage,
  errorMessage,
}: IContactSupportSubmitModalProps) {
  const customStyles = {
    content: {
      top: "5%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-90%",
      transform: "translate(-50%, -50%)",
      maxWidth: "90%",
      maxHeight: "80vh",
      overflow: "auto",
      borderRadius: "10px",
      padding: "10px",
    },
    overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
  };

  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Success Modal"
        style={customStyles}
      >
        <FlexRowCenter className="w-full rounded-[10px] px-5">
          {successMessage && (
            <span>
              {successMessage && <img src="/assets/icons/green-check.svg" />}
            </span>
          )}
          {errorMessage && (
            <span>
              {errorMessage && <img src="/assets/icons/cancel-red.svg" />}
            </span>
          )}
          <h2 className="text-[15px] font-normal font-pp text-center text-blue-200">
            {successMessage && successMessage}
            {errorMessage && errorMessage}
          </h2>
        </FlexRowCenter>
      </Modal>
    </div>
  );
}
