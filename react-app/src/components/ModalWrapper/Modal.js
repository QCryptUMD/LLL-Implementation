import styles from "./Modal.module.css";

const Modal = ({ open, onClose, children }) => {
  return (
    <div>
      {open ? (
        <>
          <div className={styles.background} onClick={() => onClose()} />
          <div className={styles.centered}>
            <div className={styles.modal}>{children}</div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Modal;
