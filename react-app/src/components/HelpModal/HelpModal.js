import { useState } from "react";
import Modal from "../ModalWrapper/Modal";
import styles from "./HelpModal.module.css";

const HelpModal = ({ open, onClose }) => {
  const handleOnClose = () => {
    onClose();
  };
  return (
    <Modal
      open={open}
      onClose={() => {
        handleOnClose();
      }}
    >
      <>
        <div className={styles.header}>
          <button
            className={styles.close}
            onClick={() => {
              handleOnClose();
            }}
          >
            &#x2715;
          </button>
          <div className={styles.heading}>Vector Input</div>
        </div>
        <div className={styles.content}>
          <div className={styles.text}>
            Input vectors as an array of numbers. To input multiple vectors,
            separate them with a semicolon
            <br />
            <br />
            For example if you type "[1,2,3,4,5]; [1,4,21,2,6]; [51,51,63,5,1]"
            it is interpreted as 3 vectors in a five-dimensional space
            <br />
            <br />
            All whitespace will be ignored.
            <br />
            Thus "[1,2,3,4]&nbsp;&nbsp;&nbsp;;&nbsp;&nbsp;&nbsp; [1,
            &nbsp;&nbsp;2&nbsp;&nbsp; ]" is equivalent to "[1,2,3,4];[1,2]"
          </div>
        </div>
      </>
    </Modal>
  );
};

export default HelpModal;
