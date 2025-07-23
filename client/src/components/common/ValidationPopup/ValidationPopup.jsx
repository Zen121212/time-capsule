import { useEffect } from "react";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";
import styles from "./ValidationPopup.module.css";

const ValidationPopup = ({
  isOpen,
  onClose,
  title = "Validation Error",
  messages = [],
}) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.iconTitle}>
            <FaExclamationTriangle className={styles.warningIcon} />
            <h3 className={styles.title}>{title}</h3>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.content}>
          {messages.length > 0 ? (
            <ul className={styles.messageList}>
              {messages.map((message, index) => (
                <li key={index} className={styles.message}>
                  {message}
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.message}>
              Please check your form and try again.
            </p>
          )}
        </div>

        <div className={styles.footer}>
          <button className={styles.okButton} onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidationPopup;
